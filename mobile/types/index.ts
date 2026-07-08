import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from 'react';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

export interface User {
    id: string;
    clerkId: string;
    opid: string;
    opid_updated_at: string | null;

    language: string;
    username: string;
    country: string;
    currency: string;

    avatar_url: string | null;
    avatar_public_id: string | null;

    is_premium: Boolean;
    premium_expire_at: string | null;

    is_active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ChartItem {
    label: string;
    value: number;
    color: string;
    icon: IoniconsName;
}

export interface DonutChartProps {
    data: ChartItem[];
    total: number;
    formatter: (amount: number) => string;
}

export interface HomeHeaderProps {
    totalBalance: number;
    primaryCurrency: string;
    accountCount: number;
}

export interface HomeSectionTitleProps {
    count: number;
}

export interface SavingsAccountCardProps {
    item: Account;
}

export interface Account {
    id: string | number;
    name: string;
    type: string;
    currency: string;
    current_balance: number;
    target_amount?: number;
}

export interface AccountSelectorProps {
    label: string;
    account: Account | null;
    onPress: () => void;
    iconName: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    iconBgClass: string;
}

export interface AccountModalProps {
    visible: boolean;
    title: string;
    accounts: Account[];
    selectedAccountId?: string | number;
    isIncome: boolean;
    onClose: () => void;
    onSelect: (account: Account) => void;
}

export interface ModeToggleProps {
    isIncome: boolean;
    onToggle: (value: boolean) => void;
}

export interface TransactionNoteProps {
    value: string;
    onChangeText: (text: string) => void;
    maxLength?: number;
}
