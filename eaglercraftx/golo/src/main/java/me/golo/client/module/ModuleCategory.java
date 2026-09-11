package me.golo.client.module;

public enum ModuleCategory {
    COMBAT("Combat"),
    VISUAL("Visual"),
    MOVEMENT("Movement"),
    PLAYER("Player"),
    CLIENT("Client");

    private final String displayName;

    ModuleCategory(String displayName) {
        this.displayName = displayName;
    }

    public String displayName() {
        return displayName;
    }
}
