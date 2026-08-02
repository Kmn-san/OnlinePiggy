import { Account, Transaction } from '@/types';
import i18n from '@/lib/i18n';

export const groupTransactionsByYear = (transactions: Transaction[], locale: string) => {
    const grouped: { [year: string]: Transaction[] } = {};

    transactions.forEach((transaction) => {
        const year = new Date(transaction.created_at).toLocaleDateString(locale, { year: 'numeric' });
        if (!grouped[year]) {
            grouped[year] = [];
        }
        grouped[year].push(transaction);
    });

    return Object.keys(grouped)
        .sort((a, b) => b.localeCompare(a))
        .map((year) => ({
            year,
            transactions: grouped[year].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ),
        }));
};

export const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getTransactionType = (transaction: Transaction, currentAccountId: string) => {
    if (transaction.from_account_id === currentAccountId) return 'expense';
    if (transaction.to_account_id === currentAccountId) return 'income';
    return 'unknown';
};

export const getTransactionIcon = (type: string) => {
    switch (type) {
        case 'income': return 'arrow-down-circle';
        case 'expense': return 'arrow-up-circle';
        case 'SAVINGS': return 'save-outline';
        case 'EXPENSES': return 'card-outline';
        default: return 'cash-outline';
    }
};

export const getTransactionBg = (type: string) => {
    switch (type) {
        case 'income': return 'bg-emerald-50';
        case 'expense': return 'bg-red-50';
        case 'SAVINGS': return 'bg-emerald-50';
        case 'EXPENSES': return 'bg-red-50';
        default: return 'bg-gray-50';
    }
};

export const getTransactionLabel = (transaction: Transaction, currentAccountId: string) => {
    if (transaction.from_account_id === currentAccountId) {
        return i18n.t('accountDetail.transaction.sent');
    } else if (transaction.to_account_id === currentAccountId) {
        return i18n.t('accountDetail.transaction.received');
    }
    return i18n.t('accountDetail.transaction.defaultLabel');
};

export const getAccountName = (accountId: string | null, accounts?: Account[]) => {
    if (!accountId) return i18n.t('accountDetail.transaction.external');
    const acc = accounts?.find((a) => a.id === accountId);
    return acc?.name ? i18n.t(`savings.${acc.name}`, { defaultValue: acc.name }) : i18n.t('accountDetail.transaction.unknownAccount');
};