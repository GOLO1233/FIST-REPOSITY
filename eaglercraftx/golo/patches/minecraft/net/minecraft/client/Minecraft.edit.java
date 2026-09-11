# GOLO Client integration patch for EaglercraftX 1.8.8
#
# This patch is kept in the GOLO tree so it can be copied into the
# EaglercraftX source tree under patches/minecraft/.
# It adds the client initializer and opens ClickGUI with Right Shift.

> INSERT  1 : 4  @  1
+
+ import me.golo.client.GoloClient;
+ import net.lax1dude.eaglercraft.v1_8.Keyboard;
+
+> INSERT  1 : 4  @  1
+
+ 	private void goloInit() {
+ 		GoloClient.init();
+ 	}
+
+> INSERT  1 : 7  @  1
+
+ 	private void goloHandleKeyboard() {
+ 		while (Keyboard.next()) {
+ 			if (Keyboard.getEventKeyState() && Keyboard.getEventKey() == 54) {
+ 				GoloClient.toggleClickGui(this);
+ 			}
+ 		}
+ 	}
+
+# IMPORTANT:
+# Call goloInit() once from startGame() after gameSettings is created.
+# Call goloHandleKeyboard() once per client tick in the existing keyboard
+# event loop. EaglercraftX already exposes Keyboard in Minecraft.edit.java.
