package com.example.edtracker

import android.content.Context
import com.example.edtracker.widget.ShiftWidgetProvider
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ShiftWidgetModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ShiftWidgetModule")

    Function("updateWidget") { payload: String ->
      val context = appContext.reactContext ?: return@Function
      val prefs = context.getSharedPreferences("ed_tracker", Context.MODE_PRIVATE)
      prefs.edit().putString("payload", payload).apply()
      ShiftWidgetProvider.updateAll(context)
    }
  }
}
