import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DonutChartProps } from "@/types";

import Svg, { Path, Circle } from 'react-native-svg';
import i18n from '@/lib/i18n';


export const DonutChart = ({ data, total, formatter }: DonutChartProps) => {
  const radius = 70;
  const strokeWidth = 30;
  const center = radius + strokeWidth / 2;
  const containerSize = center * 2;
  let cumulativeAngle = 0;

  return (
    <View className="items-center justify-center">
      <View style={{ width: containerSize, height: containerSize }} className="justify-center items-center relative">

        <Svg width={containerSize} height={containerSize} viewBox={`0 0 ${containerSize} ${containerSize}`}>
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
              /* ✨ Fixed: Capitalized Path tag */
              <Path
                key={index}
                d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color}
              />
            );
          })}

          <Circle cx={center} cy={center} r={radius - strokeWidth / 2} fill="#f9fafb" />
        </Svg>

        {/* ✨ Fixed: Using standard absolute Native layout overlays instead of unstable SVG <text> elements */}
        <View className="absolute items-center justify-center pointer-events-none">
          <Text className="text-xl font-bold text-gray-800 text-center px-4" numberOfLines={1}>
            {total > 0 ? formatter(total) : "$0"}
          </Text>
          <Text className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
            Total Expenses
          </Text>
        </View>
      </View>

      {/* Reusable Bottom Legend Badges */}
      <View className="flex-row flex-wrap justify-center mt-6 px-4">
        {data.map((item, index) => item.value > 0 && (
          <View key={index} className="flex-row items-center mx-2 mb-2 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
            <View style={{ width: 8, height: 8, backgroundColor: item.color, borderRadius: 99 }} />
            <View className="flex-row items-center ml-1.5">
              <Ionicons name={item.icon} size={11} color={item.color} style={{ marginRight: 3 }} />
              <Text className="text-xs text-gray-600 font-medium">{i18n.t(`expenses.${item.label}`)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};