package me.golo.client;

import me.golo.client.gui.GuiGoloClickGui;
import me.golo.client.module.ModuleManager;
import net.minecraft.client.Minecraft;
import net.lax1dude.eaglercraft.v1_8.Keyboard;

/** Entry point and Minecraft keyboard bridge for GOLO Client. */
public final class GoloClient {
    public static final String NAME = "GOLO Client";
    public static final String VERSION = "1.0.0-dev";

    private static final ModuleManager MODULES = new ModuleManager();
    private static boolean initialized;
    private static boolean rightShiftWasDown;

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

    /** Call once per Minecraft client tick. */
    public static void handleKeyboard(Minecraft mc) {
        if (mc == null) return;
        boolean rightShift = Keyboard.isKeyDown(54);
        if (rightShift && !rightShiftWasDown) {
            toggleClickGui(mc);
        }
        rightShiftWasDown = rightShift;
    }

    public static void toggleClickGui(Minecraft mc) {
        if (mc == null) return;
        if (mc.currentScreen instanceof GuiGoloClickGui) {
            mc.displayGuiScreen(null);
        } else {
            mc.displayGuiScreen(new GuiGoloClickGui());
        }
    }
}
