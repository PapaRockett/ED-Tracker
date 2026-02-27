package com.example.edtracker.widget

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.ComponentName
import android.content.Context
import android.widget.RemoteViews
import com.example.edtracker.R
import org.json.JSONObject

class ShiftWidgetProvider : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    appWidgetIds.forEach { appWidgetId ->
      appWidgetManager.updateAppWidget(appWidgetId, buildRemoteViews(context))
    }
  }

  companion object {
    fun updateAll(context: Context) {
      val manager = AppWidgetManager.getInstance(context)
      val ids = manager.getAppWidgetIds(ComponentName(context, ShiftWidgetProvider::class.java))
      ids.forEach { id ->
        manager.updateAppWidget(id, buildRemoteViews(context))
      }
    }

    private fun buildRemoteViews(context: Context): RemoteViews {
      val prefs = context.getSharedPreferences("ed_tracker", Context.MODE_PRIVATE)
      val payload = prefs.getString("payload", null)
      val views = RemoteViews(context.packageName, R.layout.shift_widget)

      if (payload == null) {
        views.setTextViewText(R.id.widget_title, "Set shift times in app")
        return views
      }

      val json = JSONObject(payload)
      val position = json.getJSONObject("position")
      val schedule = json.getJSONObject("schedule")
      val week = position.getInt("week")
      val dayIndex = position.getInt("dayIndex")
      val days = json.getJSONArray("days")
      val weekSchedule = schedule.getJSONObject(week.toString())

      val labels = listOf(R.id.day1, R.id.day2, R.id.day3, R.id.day4, R.id.day5)
      views.setTextViewText(R.id.widget_title, "Week $week start times")

      labels.forEachIndexed { index, viewId ->
        val day = days.getString(index)
        val time = weekSchedule.getString(day)
        val marker = if (index == dayIndex) "●" else "○"
        views.setTextViewText(viewId, "$marker $day  $time")
      }

      return views
    }
  }
}
