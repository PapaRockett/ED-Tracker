package com.example.edtracker

import expo.modules.core.interfaces.Package
import expo.modules.kotlin.modules.Module

class ShiftWidgetPackage : Package {
  override fun createModules(context: expo.modules.core.ModuleRegistry): List<Module> {
    return listOf(ShiftWidgetModule())
  }
}
