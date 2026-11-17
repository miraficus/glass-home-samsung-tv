/* Glass Home localisation: Czech/English, TV language detection and saved override. */
(function () {
  'use strict';
  var GH = window.GH = window.GH || {};
  var dictionaries = {
    en: {
      'Add photos and shortcuts':'Add photos and shortcuts',
      'Use a phone or computer on the home Wi-Fi.':'Use a phone or computer on the home Wi-Fi.',
      'Open':'Open', 'Sign in with the password':'Sign in with the password',
      'Move left':'Move left', 'Move right':'Move right', 'Remove':'Remove',
      'Hide':'Hide', 'Cancel':'Cancel', 'New password':'New password',
      'Press OK again to confirm':'Press OK again to confirm', 'Done':'Done',
      'Language':'Language', 'Automatic':'Automatic', 'Czech':'Čeština', 'English':'English',
      'Show hidden apps':'Show hidden apps', 'YouTube links':'YouTube links',
      'Not running yet':'Not running yet', 'Starting…':'Starting…',
      'nature photos':'nature photos', 'of your photos':'of your photos', 'of yours':'of yours',
      'shortcut':'shortcut', 'shortcuts':'shortcuts', 'GB free on the TV':'GB free on the TV',
      'Live TV':'Live TV'
    },
    cs: {
      'Add photos and shortcuts':'Přidat fotky a zástupce',
      'Use a phone or computer on the home Wi-Fi.':'Použijte telefon nebo počítač ve stejné Wi-Fi síti.',
      'Open':'Otevřít', 'Sign in with the password':'Přihlaste se heslem',
      'Move left':'Posunout doleva', 'Move right':'Posunout doprava',
      'Remove':'Odstranit', 'Hide':'Skrýt', 'Cancel':'Zrušit',
      'New password':'Nové heslo', 'Press OK again to confirm':'Potvrďte opětovným stiskem OK',
      'Done':'Hotovo', 'Language':'Jazyk', 'Automatic':'Automaticky',
      'Czech':'Čeština', 'English':'English', 'Show hidden apps':'Zobrazit skryté aplikace',
      'YouTube links':'Odkazy YouTube', 'Not running yet':'Zatím neběží',
      'Starting…':'Spouštění…', 'nature photos':'fotografií přírody',
      'of your photos':'vaše fotografie', 'of yours':'vašich fotografií',
      'shortcut':'zástupce', 'shortcuts':'zástupců',
      'GB free on the TV':'GB volných v televizi', 'Live TV':'Živé TV'
    }
  };
  function tvLanguage() {
    try {
      if (window.tizen && tizen.systeminfo && tizen.systeminfo.getLocale) {
        var loc = tizen.systeminfo.getLocale();
        if (loc && loc.language) return loc.language;
      }
    } catch (e) {}
    return navigator.language || 'en';
  }
  var preference = 'auto';
  try { preference = localStorage.getItem('gh.language') || 'auto'; } catch (e) {}
  if (['auto','cs','en'].indexOf(preference) < 0) preference = 'auto';
  function language() {
    var candidate = preference === 'auto' ? tvLanguage() : preference;
    return /^cs(?:[-_]|$)/i.test(candidate) || /^sk(?:[-_]|$)/i.test(candidate) ? 'cs' : 'en';
  }
  var api = {
    get: language,
    preference: function () { return preference; },
    locale: function () { return language() === 'cs' ? 'cs-CZ' : 'en-GB'; },
    t: function (key) { return dictionaries[language()][key] || key; },
    set: function (value) {
      if (['auto','cs','en'].indexOf(value) < 0) return;
      preference = value;
      try { localStorage.setItem('gh.language', value); } catch (e) {}
      document.documentElement.lang = language();
    },
    applyStatic: function () {
      document.documentElement.lang = language();
      var pairs = [
        ['.panel-title','Add photos and shortcuts'],
        ['.panel-sub','Use a phone or computer on the home Wi-Fi.'],
        ['.step:nth-child(1) .kv-label','Open'],
        ['.step:nth-child(2) .kv-label','Sign in with the password']
      ];
      pairs.forEach(function (p) {
        var el = document.querySelector(p[0]);
        if (el) el.textContent = api.t(p[1]);
      });
      var panel = document.getElementById('panel');
      if (panel) panel.setAttribute('aria-label', api.t('Add photos and shortcuts'));
    }
  };
  GH.i18n = api;
  api.applyStatic();
}());
