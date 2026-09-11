package me.golo.client.module;

public abstract class Module {
    private final String name;
    private final ModuleCategory category;
    private boolean enabled;

    protected Module(String name, ModuleCategory category) {
        this.name = name;
        this.category = category;
    }

    public final String name() {
        return name;
    }

    public final ModuleCategory category() {
        return category;
    }

    public final boolean enabled() {
        return enabled;
    }

    public final void toggle() {
        setEnabled(!enabled);
    }

    public final void setEnabled(boolean value) {
        if (enabled == value) return;
        enabled = value;
        if (enabled) onEnable();
        else onDisable();
    }

    protected void onEnable() {
    }

    protected void onDisable() {
    }
}
