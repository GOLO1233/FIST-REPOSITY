package me.golo.client.gui;

import java.io.IOException;
import java.util.List;

import me.golo.client.GoloClient;
import me.golo.client.module.Module;
import me.golo.client.module.ModuleCategory;
import net.minecraft.client.gui.GuiButton;
import net.minecraft.client.gui.GuiScreen;
import net.minecraft.client.renderer.GlStateManager;

/**
 * Lightweight ClickGUI designed for EaglercraftX 1.8.8.
 * Right Shift is handled by the Minecraft patch and opens this screen.
 */
public class GuiGoloClickGui extends GuiScreen {
    private ModuleCategory selected = ModuleCategory.VISUAL;
    private int panelX;
    private int panelY;
    private int panelW;
    private int panelH;

    @Override
    public void initGui() {
        buttonList.clear();
        rebuildButtons();
    }

    private void rebuildButtons() {
        buttonList.clear();
        panelW = Math.min(720, width - 40);
        panelH = Math.min(430, height - 40);
        panelX = (width - panelW) / 2;
        panelY = (height - panelH) / 2;

        int y = panelY + 62;
        for (Module module : GoloClient.modules().getModules(selected)) {
            buttonList.add(new GuiButton(module.getId(), panelX + 220, y, 230, 24,
                    module.getName() + (module.isEnabled() ? "  [ON]" : "  [OFF]")));
            y += 30;
        }
    }

    @Override
    public void drawScreen(int mouseX, int mouseY, float partialTicks) {
        drawDefaultBackground();
        drawRect(0, 0, width, height, 0xB8000000);

        drawRect(panelX, panelY, panelX + panelW, panelY + panelH, 0xFF0B0D13);
        drawRect(panelX, panelY, panelX + panelW, panelY + 3, 0xFF7C5CFF);
        drawRect(panelX, panelY + 44, panelX + panelW, panelY + 45, 0xFF252A3A);
        drawRect(panelX + 200, panelY + 45, panelX + 201, panelY + panelH, 0xFF252A3A);

        drawString(fontRendererObj, "GOLO CLIENT", panelX + 20, panelY + 17, 0xFFFFFFFF);
        drawString(fontRendererObj, "1.8.8", panelX + panelW - 45, panelY + 18, 0xFF8E96AD);
        drawString(fontRendererObj, selected.getDisplayName(), panelX + 220, panelY + 50, 0xFFBBAEFF);

        int cy = panelY + 64;
        for (ModuleCategory category : ModuleCategory.values()) {
            int color = category == selected ? 0xFF7C5CFF : 0xFF8E96AD;
            if (category == selected) {
                drawRect(panelX + 10, cy - 5, panelX + 190, cy + 19, 0xFF19162A);
            }
            drawString(fontRendererObj, category.getDisplayName(), panelX + 22, cy + 2, color);
            cy += 30;
        }

        super.drawScreen(mouseX, mouseY, partialTicks);
        GlStateManager.disableBlend();
    }

    @Override
    protected void actionPerformed(GuiButton button) throws IOException {
        if (button.id >= 1000) {
            Module module = GoloClient.modules().getById(button.id);
            if (module != null) {
                module.toggle();
                rebuildButtons();
            }
            return;
        }

        if (button.id >= 100 && button.id < 200) {
            ModuleCategory[] values = ModuleCategory.values();
            int index = button.id - 100;
            if (index >= 0 && index < values.length) {
                selected = values[index];
                rebuildButtons();
            }
        }
    }

    @Override
    protected void mouseClicked(int mouseX, int mouseY, int mouseButton) throws IOException {
        int cy = panelY + 64;
        ModuleCategory[] categories = ModuleCategory.values();
        for (int i = 0; i < categories.length; i++) {
            if (mouseX >= panelX + 10 && mouseX <= panelX + 190 && mouseY >= cy - 5 && mouseY <= cy + 19) {
                selected = categories[i];
                rebuildButtons();
                return;
            }
            cy += 30;
        }
        super.mouseClicked(mouseX, mouseY, mouseButton);
    }

    @Override
    protected void keyTyped(char typedChar, int keyCode) throws IOException {
        if (keyCode == 1) {
            mc.displayGuiScreen(null);
            return;
        }
        super.keyTyped(typedChar, keyCode);
    }

    @Override
    public boolean doesGuiPauseGame() {
        return false;
    }
}
