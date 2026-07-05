import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

interface ChartItem {
  label: string;
  value: number;
  color: string;
  icon: IoniconsName;
}

interface DonutChartProps {
  data: ChartItem[];
  total: number;
  formatter: (amount: number) => string;
}

export const DonutChart = ({ data, total, formatter }: DonutChartProps) => {
  const radius = 70;
  const strokeWidth = 30;
  const center = radius + strokeWidth / 2;
  let cumulativeAngle = 0;

  return (
    <View className="items-center justify-center">
      <View style={{ width: center * 2, height: center * 2 }}>
        <svg width={center * 2} height={center * 2} viewBox={`0 0 ${center * 2} ${center * 2}`}>
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const angle = (percentage / 100) * 360;
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;
            cumulativeAngle += angle;

            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);
            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);
            const largeArc = angle > 180 ? 1 : 0;

            if (percentage === 0) return null;

            return (
              <path
                key={index}
                d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color}
              />
            );
          })}
          <circle cx={center} cy={center} r={radius - strokeWidth / 2} fill="#f9fafb" />
          <text x={center} y={center - 10} textAnchor="middle" className="text-2xl font-bold" fill="#1f2937">
            {total > 0 ? formatter(total) : "$0"}
          </text>
          <text x={center} y={center + 20} textAnchor="middle" className="text-xs" fill="#6b7280">
            Total Expenses
          </text>
        </svg>
      </View>

      <View className="flex-row flex-wrap justify-center mt-4 px-4">
        {data.map((item, index) => item.value > 0 && (
          <View key={index} className="flex-row items-center mx-2 mb-2">
            <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 3 }} />
            <View className="flex-row items-center ml-1">
              <Ionicons name={item.icon} size={12} color={item.color} style={{ marginRight: 2 }} />
              <Text className="text-xs text-gray-700">{item.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};