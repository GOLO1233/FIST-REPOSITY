# GOLO Client integration patch for EaglercraftX 1.8.8
#
# This is an ADDITIVE patch fragment for the existing upstream
# Minecraft.edit.java. Do not replace the upstream patch with this file.
#
# Safe client-side features: native GOLO ClickGUI, HUD/modules, and
# keyboard handling. No server automation or anti-cheat bypass.

> INSERT  1 : 2  @  1
+
+ import me.golo.client.GoloClient;
+
+> CHANGE  4 : 7  @  4 : 6
+
+~ 	private void startGame() throws IOException {
+~ 		this.gameSettings = new GameSettings(this);
+~ 		GoloClient.init();
+~ 		Config.setGameObj(this);
+
+# Keyboard hook:
+# Add this one line to the existing per-tick keyboard/event processing in
+# Minecraft.edit.java, after Minecraft's normal Keyboard.next() processing:
+#
+# 		GoloClient.handleKeyboard(this);
+#
+# GoloClient itself performs edge detection, so Right Shift opens/closes
+# the native GOLO ClickGUI only once per key press.
