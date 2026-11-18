/* =========================================================================
   resume.js — renders resume.md into the page.

   resume.md is the single source of truth for the résumé. Both resume.html
   (the styled site page) and resume-print.html (the plain page that
   scripts/build-resume-pdf.sh prints to assets/dwayne-pugh-resume.pdf) load
   this file and call ResumeRender.mount(mode).

   Only the small Markdown subset resume.md uses is supported:
     # Name              then a title paragraph and a contact paragraph
     ## Section          Summary, Skills, Experience, Education..., etc.
     ### Employer        a heading WITHOUT " · " groups the roles under it
     ### / #### Role · Dates   a heading WITH " · " is one entry
     paragraphs, "- " bullets, **bold**, *italic*, [text](url)
   Conventions per section:
     Skills:        "- **Label:** a, b, c"   -> one skill group of tags
                    (use "a; b, c; d" when a skill itself contains commas)
     Education:     "### Degree — School · Year", "**Certifications:** a · b"
   ========================================================================= */
(function () {
  'use strict';

  // ---- Inline Markdown ---------------------------------------------------
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function inline(s) {
    var out = esc(s);
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, text, url) {
      var safe = /^(https?:|mailto:)/.test(url) ? url : '#';
      var ext = /^https?:/.test(safe) ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + safe + '"' + ext + '>' + text + '</a>';
    });
    out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
    return out;
  }

  function stripMd(s) {
    return s.replace(/\*\*|\*/g, '').trim();
  }

  // ---- Block parsing -----------------------------------------------------
  // Returns a flat list of {type: 'h1'..'h4' | 'p' | 'li', text}
  function blocks(md) {
    var lines = md.replace(/\r\n?/g, '\n').split('\n');
    var out = [];
    var cur = null;
    function flush() { if (cur) { out.push(cur); cur = null; } }
    lines.forEach(function (line) {
      var m;
      if (!line.trim()) { flush(); return; }
      if ((m = /^(#{1,4})\s+(.*)$/.exec(line))) {
        flush(); out.push({ type: 'h' + m[1].length, text: m[2].trim() }); return;
      }
      if ((m = /^[-*]\s+(.*)$/.exec(line))) {
        flush(); cur = { type: 'li', text: m[1].trim() }; return;
      }
      if (cur) { cur.text += ' ' + line.trim(); return; }
      cur = { type: 'p', text: line.trim() };
    });
    flush();
    return out;
  }

  // ---- Document model ----------------------------------------------------
  function splitLast(s, sep) {
    var i = s.lastIndexOf(sep);
    return i < 0 ? [s, ''] : [s.slice(0, i).trim(), s.slice(i + sep.length).trim()];
  }

  function model(md) {
    var doc = { name: '', title: '', contact: '', sections: [] };
    var section = null, group = null, entry = null, headerParas = 0;

    blocks(md).forEach(function (b) {
      if (b.type === 'h1') { doc.name = b.text; return; }
      if (b.type === 'h2') {
        section = { title: b.text, intro: [], items: [], groups: [], trailing: [] };
        doc.sections.push(section); group = null; entry = null; return;
      }
      if (!section) {
        if (b.type === 'p') {
          if (headerParas === 0) doc.title = b.text; else doc.contact = b.text;
          headerParas++;
        }
        return;
      }
      if (b.type === 'h3' || b.type === 'h4') {
        if (b.text.indexOf(' · ') >= 0) {
          var parts = splitLast(b.text, ' · ');
          entry = { heading: parts[0], date: parts[1], paras: [], bullets: [] };
          if (!group || b.type === 'h3') { group = { name: '', entries: [] }; section.groups.push(group); }
          group.entries.push(entry);
        } else {
          group = { name: b.text, entries: [] }; section.groups.push(group); entry = null;
        }
        return;
      }
      if (entry) {
        (b.type === 'li' ? entry.bullets : entry.paras).push(b.text);
      } else if (b.type === 'li') {
        section.items.push(b.text);
      } else if (section.groups.length) {
        section.trailing.push(b.text);
      } else {
        section.intro.push(b.text);
      }
    });
    return doc;
  }

  // Split "a, b (c, d), and e" on top-level commas. If the line uses
  // semicolons, split on those instead, so a skill may contain commas.
  function splitList(s) {
    if (s.indexOf(';') >= 0) {
      return s.split(';').map(function (t) { return t.trim(); }).filter(Boolean);
    }
    var out = [], depth = 0, buf = '';
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '(') depth++;
      if (c === ')') depth--;
      if (c === ',' && depth === 0) { out.push(buf); buf = ''; continue; }
      buf += c;
    }
    out.push(buf);
    return out.map(function (t) { return t.trim().replace(/^and\s+/, ''); }).filter(Boolean);
  }

  function labelled(text) {
    var m = /^\*\*(.+?):?\*\*:?\s*(.*)$/.exec(text);
    return m ? { label: m[1].replace(/:$/, ''), rest: m[2] } : null;
  }

  function slug(s) {
    return s.toLowerCase().replace(/&/g, '').replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');
  }

  // ---- Site rendering (resume.html) --------------------------------------
  function roleHtml(heading) {
    var m = /^(.*?)\s*(\([^)]*\))$/.exec(heading);
    return m ? inline(m[1]) + ' <span class="exp-entry__note">' + inline(m[2]) + '</span>' : inline(heading);
  }

  function entrySite(e) {
    var h = '<div class="exp-entry"><div class="exp-entry__header"><div>' +
      '<p class="exp-entry__role">' + roleHtml(e.heading) + '</p>';
    var scope = [];
    e.paras.forEach(function (p) {
      if (/^\*[^*].*\*$/.test(p)) h += '<p class="exp-entry__org">' + inline(p.slice(1, -1)) + '</p>';
      else scope.push(p);
    });
    h += '</div><span class="exp-entry__date mono">' + inline(e.date) + '</span></div>';
    scope.forEach(function (p) { h += '<p class="exp-entry__scope">' + inline(p) + '</p>'; });
    if (e.bullets.length) {
      h += '<ul class="exp-entry__bullets">' + e.bullets.map(function (b) {
        return '<li>' + inline(b) + '</li>';
      }).join('') + '</ul>';
    }
    return h + '</div>';
  }

  function sectionSite(s) {
    var key = s.title.toLowerCase();
    var h = '';

    if (key === 'summary') {
      return s.intro.map(function (p) { return '<div class="resume-summary">' + inline(p) + '</div>'; }).join('');
    }

    h += '<section class="resume-section"><h2 class="resume-section__heading">' + inline(s.title) +
      ' <span class="resume-section__heading-label mono">// ' + slug(s.title) + '</span></h2>';
    s.intro.forEach(function (p) { h += '<p class="exp-entry__scope">' + inline(p) + '</p>'; });

    if (key === 'skills') {
      h += '<div class="skills-grid">';
      s.items.forEach(function (it) {
        var l = labelled(it);
        if (!l) return;
        h += '<div class="skill-group"><p class="skill-group__label mono">// ' + esc(l.label.toLowerCase()) +
          '</p><div class="skill-group__tags">' +
          splitList(stripMd(l.rest)).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('') +
          '</div></div>';
      });
      return h + '</div></section>';
    }

    if (key.indexOf('education') === 0) {
      h += '<div class="edu-grid">';
      s.groups.forEach(function (g) {
        g.entries.forEach(function (e) {
          // A "**Label:** a · b" line after the last degree is the cert list, not a note.
          e.paras = e.paras.filter(function (p) {
            if (labelled(p)) { s.trailing.push(p); return false; }
            return true;
          });
          var ds = splitLast(e.heading, ' — ');
          h += '<div class="edu-entry"><p class="edu-entry__degree">' + inline(ds[0]) + '</p>' +
            '<p class="edu-entry__school">' + inline(ds[1]) + '</p>' +
            '<p class="edu-entry__year mono">' + inline(e.date) + '</p>' +
            e.bullets.concat(e.paras).map(function (n) { return '<p class="edu-entry__note">' + inline(n) + '</p>'; }).join('') +
            '</div>';
        });
      });
      h += '</div>';
      s.trailing.forEach(function (p) {
        var l = labelled(p);
        if (l) {
          h += '<div class="cert-list">' + l.rest.split(' · ').map(function (c) {
            return '<span class="cert-tag">' + esc(stripMd(c)) + '</span>';
          }).join('') + '</div>';
        } else {
          h += '<p class="exp-entry__scope">' + inline(p) + '</p>';
        }
      });
      return h + '</section>';
    }

    s.items.forEach(function (it) { h += '<p class="exp-entry__scope">' + inline(it) + '</p>'; });
    s.groups.forEach(function (g) {
      h += '<div class="employer">';
      if (g.name) {
        var nl = g.name.split(' — ');
        h += '<p class="employer__name">' + inline(nl[0]) +
          (nl[1] ? ' <span class="employer__loc">— ' + inline(nl.slice(1).join(' — ')) + '</span>' : '') + '</p>';
      }
      h += g.entries.map(entrySite).join('') + '</div>';
    });
    s.trailing.forEach(function (p) { h += '<p class="exp-entry__scope">' + inline(p) + '</p>'; });
    return h + '</section>';
  }

  function renderSite(doc) {
    setText('resume-name', doc.name);
    setHtml('resume-title', inline(doc.title));
    setHtml('resume-contact', doc.contact.split(' · ').map(function (c) {
      return '<span>' + inline(c) + '</span>';
    }).join('<span aria-hidden="true">·</span>'));
    return doc.sections.map(sectionSite).join('');
  }

  // ---- Print rendering (resume-print.html) -------------------------------
  function entryPrint(e, level) {
    var h = '<div class="entry"><h' + level + ' class="entry__head"><span>' + inline(e.heading) +
      '</span><span class="entry__date">' + inline(e.date) + '</span></h' + level + '>';
    e.paras.forEach(function (p) { h += '<p>' + inline(p) + '</p>'; });
    if (e.bullets.length) h += '<ul>' + e.bullets.map(function (b) { return '<li>' + inline(b) + '</li>'; }).join('') + '</ul>';
    return h + '</div>';
  }

  function renderPrint(doc) {
    var h = '<header class="head"><h1>' + inline(doc.name) + '</h1><p class="head__title">' + inline(doc.title) +
      '</p><p class="head__contact">' + inline(doc.contact) + '</p></header>';
    doc.sections.forEach(function (s) {
      h += '<section><h2>' + inline(s.title) + '</h2>';
      s.intro.forEach(function (p) { h += '<p>' + inline(p) + '</p>'; });
      if (s.items.length) h += '<ul>' + s.items.map(function (i) { return '<li>' + inline(i) + '</li>'; }).join('') + '</ul>';
      s.groups.forEach(function (g) {
        if (g.name) h += '<h3 class="employer">' + inline(g.name) + '</h3>';
        h += g.entries.map(function (e) { return entryPrint(e, g.name ? 4 : 3); }).join('');
      });
      s.trailing.forEach(function (p) { h += '<p>' + inline(p) + '</p>'; });
      h += '</section>';
    });
    return h;
  }

  // ---- Mount -------------------------------------------------------------
  function setText(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  function setHtml(id, v) { var el = document.getElementById(id); if (el) el.innerHTML = v; }

  function mount(mode) {
    var target = document.getElementById('resume-body');
    return fetch('resume.md', { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (md) {
        var doc = model(md);
        target.innerHTML = mode === 'print' ? renderPrint(doc) : renderSite(doc);
        document.documentElement.setAttribute('data-resume', 'ready');
      })
      .catch(function (err) {
        document.documentElement.setAttribute('data-resume', 'error');
        if (window.console) console.error('resume.md failed to load:', err);
        var fb = document.getElementById('resume-fallback');
        if (fb) fb.hidden = false;
      });
  }

  window.ResumeRender = { mount: mount, model: model };
})();
