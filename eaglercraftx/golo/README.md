# GOLO Client 1.8.8

Client-side UI/HUD foundation for an EaglercraftX 1.8.8-based client.

## Structure

```text
eaglercraftx/
└── golo/
    ├── README.md
    ├── apply-golo-client.bat
    ├── patches/minecraft/net/minecraft/client/Minecraft.edit.java
    ├── src/main/java/me/golo/client/
    │   ├── GoloClient.java
    │   ├── gui/GuiGoloClickGui.java
    │   ├── module/Module.java
    │   ├── module/ModuleCategory.java
    │   ├── module/ModuleManager.java
    │   └── module/impl/
    │       ├── HUDModule.java
    │       ├── KeystrokesModule.java
    │       └── FPSModule.java
    └── web/clickgui.html
```

## EaglercraftX build integration

The official EaglercraftX 1.8.8 source uses `sources/main/java` for the Java sources and its BuildTools applies the `patches/minecraft` changes before compiling the browser client. Java 11 is the minimum; Java 17 is recommended.

1. Clone/download `Eaglercraft-Archive/Eaglercraftx-1.8.8-src`.
2. Put this GOLO repository next to it, or keep its path anywhere on disk.
3. Run:

```bat
apply-golo-client.bat "C:\path\to\Eaglercraftx-1.8.8-src"
```

4. The script copies `src/main/java/me/golo/client` into the EaglercraftX source tree.
5. Merge the small GOLO keyboard hook from `patches/minecraft/net/minecraft/client/Minecraft.edit.java` into the existing upstream `Minecraft.edit.java` rather than replacing that file. The upstream patch already contains important Eaglercraft changes.
6. The hook must call `GoloClient.init()` once after `gameSettings` is created and `GoloClient.handleKeyboard(this)` once per client tick.
7. Build with the normal EaglercraftX `CompileLatestClient.bat`.

After the hook is applied, **Right Shift** opens the native Minecraft ClickGUI. `ESC` closes it. The GUI is a real `GuiScreen`, not the HTML preview.

## First milestone

- Native EaglercraftX ClickGUI screen.
- Right Shift toggle.
- Combat / Visual / Movement / Player / Client categories.
- Module toggle buttons.
- Non-pausing GUI.
- Standalone browser preview for quick UI testing.

No anti-cheat bypass, automated combat, reach, fly, or other unfair-server features are included.
