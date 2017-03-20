// -*- mode: gnome-shell; -*-

emacs = {};

emacs.verbose = true;

// return sane dbus values
imports.ui.shellDBus.GnomeShell.prototype.Eval = (code) => {
    let result;
    let success = true;
    try {
        result = eval(code);
    } catch(e) {
        result = '' + e;
        success = false;
    }
    return [success, result === undefined ? "" : result.toString()];
};

const JsParse = imports.misc.jsParse;

let commandHeader = 'const Clutter = imports.gi.Clutter; ' +
                    'const GLib = imports.gi.GLib; ' +
                    'const GObject = imports.gi.GObject; ' +
                    'const Gio = imports.gi.Gio; ' +
                    'const Gtk = imports.gi.Gtk; ' +
                    'const Mainloop = imports.mainloop; ' +
                    'const Meta = imports.gi.Meta; ' +
                    'const Shell = imports.gi.Shell; ' +
                    'const Main = imports.ui.main; ' +
                    'const Lang = imports.lang; ' +
                    'const Tweener = imports.ui.tweener; ' +
                    /* Utility functions...we should probably be able to use these
                     * in the shell core code too. */
                    'const stage = global.stage; ';

let _getAutoCompleteGlobalKeywords = () => {
    const keywords = ['true', 'false', 'null', 'new'];
    // Don't add the private properties of window (i.e., ones starting with '_')
    const windowProperties = Object.getOwnPropertyNames(window).filter(function(a){ return a.charAt(0) != '_' });
    const headerProperties = JsParse.getDeclaredConstants(commandHeader);

    return keywords.concat(windowProperties).concat(headerProperties);
}

emacs.completion_candidates = (text) => {
    const AUTO_COMPLETE_GLOBAL_KEYWORDS = _getAutoCompleteGlobalKeywords();
    let [completions, attrHead] = JsParse.getCompletions(text, commandHeader, AUTO_COMPLETE_GLOBAL_KEYWORDS);
    return completions;
};
