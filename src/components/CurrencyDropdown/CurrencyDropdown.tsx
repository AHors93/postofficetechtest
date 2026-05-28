import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Flag } from '../Flag';

interface Props {
  value: string;
  options: string[];
  onSelect: (code: string) => void;
  accessibilityLabel?: string;
  testID?: string;
}

export function CurrencyDropdown({
  value,
  options,
  onSelect,
  accessibilityLabel,
  testID,
}: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (code: string) => {
    setOpen(false);
    if (code !== value) onSelect(code);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.triggerPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open }}
        testID={testID}
      >
        <Flag code={value} size={28} />
        <Text style={styles.triggerLabel}>{value}</Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpen(false)}
          testID={testID ? `${testID}-backdrop` : undefined}
        >
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Select currency</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((code) => {
                const selected = code === value;
                return (
                  <Pressable
                    key={code}
                    onPress={() => handleSelect(code)}
                    style={({ pressed }) => [
                      styles.row,
                      pressed && styles.rowPressed,
                      selected && styles.rowSelected,
                    ]}
                    accessibilityRole="button"
                    testID={testID ? `${testID}-${code}` : undefined}
                  >
                    <Flag code={code} size={28} />
                    <Text style={styles.rowText}>{code}</Text>
                    {selected && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  triggerPressed: {
    backgroundColor: '#F4F4F7',
  },
  triggerLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  chevron: {
    fontSize: 14,
    color: '#666',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    maxHeight: '70%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  sheetTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1.5,
    textAlign: 'center',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  rowPressed: {
    backgroundColor: '#F4F4F7',
  },
  rowSelected: {
    backgroundColor: '#FFF5F6',
  },
  rowText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  check: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E4002B',
  },
});
