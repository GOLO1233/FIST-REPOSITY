package me.golo.client.module;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import me.golo.client.module.impl.FPSModule;
import me.golo.client.module.impl.HUDModule;
import me.golo.client.module.impl.KeystrokesModule;

public final class ModuleManager {
    private final List<Module> modules = new ArrayList<>();
    private boolean defaultsRegistered;

    public void register(Module module) {
        if (module == null) throw new IllegalArgumentException("module");
        module.setId(1000 + modules.size());
        modules.add(module);
    }

    public void registerDefaults() {
        if (defaultsRegistered) return;
        defaultsRegistered = true;
        register(new HUDModule());
        register(new FPSModule());
        register(new KeystrokesModule());
    }

    public List<Module> all() {
        return Collections.unmodifiableList(modules);
    }

    public List<Module> byCategory(ModuleCategory category) {
        List<Module> result = new ArrayList<>();
        for (Module module : modules) {
            if (module.category() == category) result.add(module);
        }
        return result;
    }

    public List<Module> getModules(ModuleCategory category) {
        return byCategory(category);
    }

    public Module getById(int id) {
        for (Module module : modules) {
            if (module.getId() == id) return module;
        }
        return null;
    }
}
