import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Shell from 'gi://Shell';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';


export default class WindowTitleLeft extends Extension {
   enable() {
    this._tracker = Shell.WindowTracker.get_default(); //app detection


    
    this._pill = Main.panel._leftBox.get_children()[0];

    this._box = new St.BoxLayout({
        y_align: Clutter.ActorAlign.CENTER,
        style_class: 'window-title-container',
    });

    this._icon = new St.Icon({
        icon_size: 16,
        style_class: 'window-title-icon',
    });

    this._label = new St.Label({
        text: '',
        y_align: Clutter.ActorAlign.CENTER,
        style_class: 'window-title-left',
    });
    this._label.clutter_text.single_line_mode = true;
    this._label.clutter_text.ellipsize = 3;

    this._box.add_child(this._icon);
    this._box.add_child(this._label);

    if (this._pill) {
        this._pill.remove_all_children?.();
        this._pill.add_child(this._box);
    }
    this._focusSignal = global.display.connect(
        'notify::focus-window',
        () => this._updateTitle()
    );
    this._updateTitle();
}
disable() {
        if (this._focusSignal)
            global.display.disconnect(this._focusSignal);

        if (this._workspaceSignal)
            global.workspace_manager.disconnect(this._workspaceSignal);

        if (this._label) {
            this._label.destroy();
            this._label = null;
        }
    }
_updateTitle() {
    const win = global.display.get_focus_window();
    if (!win) {
    this._box.visible = false;
    return;
    }

const app = this._tracker.get_window_app(win);

if (!app) {
    this._box.visible = false;
    return;
}
 this._label.set_text(app.get_name());
    this._icon.gicon = app.get_icon();
    this._box.visible = true;
}

}
// maybe add something like animation