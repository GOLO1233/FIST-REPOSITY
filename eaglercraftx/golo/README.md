# GOLO Client 1.8.8

Client-side UI/HUD foundation for an EaglercraftX 1.8.8-based client.

## Structure

```text
eaglercraftx/
└── golo/
    ├── README.md
    ├── src/main/java/me/golo/client/
    │   ├── GoloClient.java
    │   ├── module/Module.java
    │   ├── module/ModuleCategory.java
    │   ├── module/ModuleManager.java
    │   └── module/impl/
    │       ├── HUDModule.java
    │       ├── KeystrokesModule.java
    │       └── FPSModule.java
    └── web/
        └── clickgui.html
```

The Java side is deliberately separated from the browser preview so it can later be wired into the EaglercraftX patch/source workspace. The `web/clickgui.html` file is a standalone working preview of the GUI and does not pretend to be the compiled Minecraft client.

## First milestone

- Right Shift opens/closes ClickGUI in the preview.
- Categories: Combat, Visual, Movement, Player, Client.
- Modules can be toggled by clicking them.
- Enabled modules are shown in the ArrayList panel.
- Settings panel is prepared for the next milestone.

No anti-cheat bypass, automated combat, reach, fly, or other unfair-server features are included.
