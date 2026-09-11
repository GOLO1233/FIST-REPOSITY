package me.golo.client;

import me.golo.client.module.ModuleManager;

/**
 * Entry point for the GOLO client layer.
 *
 * This class is intentionally independent from Minecraft/Eaglercraft classes
 * until the project is wired into the EaglercraftX patch workspace.
 */
public final class GoloClient {
    public static final String NAME = "GOLO Client";
    public static final String VERSION = "1.0.0-dev";

    private static final ModuleManager MODULES = new ModuleManager();

    private GoloClient() {
    }

    public static ModuleManager modules() {
        return MODULES;
    }

    public static void init() {
        MODULES.registerDefaults();
    }
}
