import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  NativeModules,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {
  DAYS,
  SHIFT_OPTIONS,
  ShiftOption,
  ShiftSchedule,
  buildDefaultSchedule,
  getCurrentCyclePosition,
  serializeWidgetPayload
} from './src/schedule';

const STORAGE_KEY = 'ed-schedule';
const ShiftWidgetModule = NativeModules.ShiftWidgetModule as undefined | {
  updateWidget: (payload: string) => void;
};

const App = () => {
  const [schedule, setSchedule] = useState<ShiftSchedule>(buildDefaultSchedule());
  const [supportsNativeWidget, setSupportsNativeWidget] = useState(true);
  const current = useMemo(() => getCurrentCyclePosition(), []);

  useEffect(() => {
    setSupportsNativeWidget(Boolean(ShiftWidgetModule));
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (!saved) return;
      setSchedule(JSON.parse(saved));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    ShiftWidgetModule?.updateWidget(serializeWidgetPayload(schedule));
  }, [schedule]);

  const updateTime = (week: number, day: (typeof DAYS)[number], value: ShiftOption) => {
    setSchedule((previous) => ({
      ...previous,
      [week]: {
        ...previous[week],
        [day]: value
      }
    }));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>5-Week Start Time Tracker</Text>
        <Text style={styles.subtitle}>Monday to Friday only. Weekends are hidden.</Text>

        <View style={styles.currentCard}>
          <Text style={styles.currentWeek}>Current cycle week: {current.week}</Text>
          <Text style={styles.currentDay}>
            Today: {current.day}
            {current.isWeekend ? ' (weekend mapped to Friday)' : ''}
          </Text>
        </View>

        <View style={styles.helpCard}>
          <Text style={styles.helpTitle}>Widget help</Text>
          <Text style={styles.helpText}>
            To use the home-screen widget, create a development build (not Expo Go), then long-press
            your Android home screen and add "ED Tracker".
          </Text>
          {!supportsNativeWidget && (
            <Text style={styles.warningText}>
              You are likely running in Expo Go via QR. The widget updates are unavailable there.
            </Text>
          )}
        </View>

        {[1, 2, 3, 4, 5].map((week) => (
          <View key={week} style={styles.weekCard}>
            <Text style={styles.weekTitle}>Week {week}</Text>
            {DAYS.map((day, dayIndex) => (
              <View
                key={`${week}-${day}`}
                style={[
                  styles.row,
                  week === current.week && dayIndex === current.dayIndex && styles.activeRow
                ]}
              >
                <Text style={styles.dayLabel}>{day}</Text>
                <View style={styles.pickerWrap}>
                  <Picker
                    selectedValue={schedule[week][day]}
                    onValueChange={(value) => updateTime(week, day, value as ShiftOption)}
                    mode="dropdown"
                    style={styles.picker}
                  >
                    {SHIFT_OPTIONS.map((option) => (
                      <Picker.Item key={option} label={option} value={option} />
                    ))}
                  </Picker>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f3f4f8' },
  container: { padding: 16, gap: 12, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#5c5f70' },
  currentCard: {
    backgroundColor: '#dbeafe',
    borderColor: '#60a5fa',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12
  },
  currentWeek: { fontWeight: '700' },
  currentDay: { marginTop: 4 },
  helpCard: {
    backgroundColor: '#ecfeff',
    borderColor: '#67e8f9',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 6
  },
  helpTitle: { fontSize: 16, fontWeight: '700', color: '#155e75' },
  helpText: { color: '#0f172a' },
  warningText: { color: '#b45309', fontWeight: '600' },
  weekCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    gap: 8
  },
  weekTitle: { fontSize: 18, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#f8fafc'
  },
  activeRow: {
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff'
  },
  dayLabel: { fontWeight: '600', width: 90 },
  pickerWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden'
  },
  picker: {
    width: '100%',
    height: 44
  }
});

export default App;
