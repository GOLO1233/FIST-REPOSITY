package me.golo.client;

import me.golo.client.gui.GuiGoloClickGui;
import me.golo.client.module.ModuleManager;
import net.minecraft.client.Minecraft;

/** Entry point for the GOLO client layer. */
public final class GoloClient {
    public static final String NAME = "GOLO Client";
    public static final String VERSION = "1.0.0-dev";

    private static final ModuleManager MODULES = new ModuleManager();
    private static boolean initialized;

    private GoloClient() {
    }

    public static void init() {
        if (!initialized) {
            MODULES.registerDefaults();
            initialized = true;
        }
    }

    public static ModuleManager modules() {
        return MODULES;
    }

    public static void toggleClickGui(Minecraft mc) {
        if (mc == null) {
            return;
        }
        if (mc.currentScreen instanceof GuiGoloClickGui) {
            mc.displayGuiScreen(null);
        } else {
            mc.displayGuiScreen(new GuiGoloClickGui());
        }
    }
}
