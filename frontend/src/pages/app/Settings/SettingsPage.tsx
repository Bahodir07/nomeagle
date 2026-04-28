import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../../components/ui';
import { useUiSettings } from '../../../app/store/ui.store';
import { useAuth } from '../../../app/store/auth.store';
import { deleteAccount } from '../../../app/api/profile';
import {
    SettingsSectionCard,
    ThemeSetting,
    LanguageSetting,
    AudioSetting,
    NotificationSetting,
    AccountActions,
} from '../../../features/settings/components';
import { MOCK_USER_SETTINGS } from '../../../features/settings/mock/settings.mock';
import type { SettingsLanguage } from '../../../features/settings/types';
import styles from './SettingsPage.module.css';

export const SettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const { theme, language, setTheme, setLanguage } = useUiSettings();
    const { logout } = useAuth();

    const [sfxEnabled, setSfxEnabled] = useState(MOCK_USER_SETTINGS.sfxEnabled);
    const [autoplayAudio, setAutoplayAudio] = useState(MOCK_USER_SETTINGS.autoplayAudio);
    const [dailyReminderEnabled, setDailyReminderEnabled] = useState(
        MOCK_USER_SETTINGS.dailyReminderEnabled
    );

    const [toast, setToast] = useState<{ open: boolean; message: string }>({
        open: false,
        message: '',
    });

    const showToast = useCallback((message: string) => {
        setToast({ open: true, message });
    }, []);

    const closeToast = useCallback(() => {
        setToast((prev) => ({ ...prev, open: false }));
    }, []);

    const handleThemeChange = useCallback(
        (next: typeof theme) => {
            setTheme(next);
            showToast('Theme updated');
        },
        [setTheme, showToast]
    );

    const handleLanguageChange = useCallback(
        (next: SettingsLanguage) => {
            setLanguage(next);
            showToast('Language updated');
        },
        [setLanguage, showToast]
    );

    const handleSfxChange = useCallback(
        (enabled: boolean) => {
            setSfxEnabled(enabled);
            showToast(enabled ? 'Sound effects on' : 'Sound effects off');
        },
        [showToast]
    );

    const handleAutoplayChange = useCallback(
        (enabled: boolean) => {
            setAutoplayAudio(enabled);
            showToast(enabled ? 'Autoplay on' : 'Autoplay off');
        },
        [showToast]
    );

    const handleDailyReminderChange = useCallback(
        (enabled: boolean) => {
            setDailyReminderEnabled(enabled);
            showToast(enabled ? 'Daily reminder on' : 'Daily reminder off');
        },
        [showToast]
    );

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            navigate('/login');
        } catch {
            showToast('Logout failed');
        }
    }, [logout, navigate, showToast]);

    const handleDeleteAccount = useCallback(async () => {
        try {
            await deleteAccount();
            await logout();
            navigate('/login');
        } catch {
            showToast('Failed to delete account. Please try again.');
        }
    }, [logout, navigate, showToast]);

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <h1 className={styles.title} id="settings-page-title">
                    Settings
                </h1>
                <p className={styles.subtitle} id="settings-page-subtitle">
                    Customize your experience.
                </p>
            </header>

            <div className={styles.sections} role="list">
                <div className={styles.sectionItem} role="listitem">
                    <SettingsSectionCard
                        title="Appearance"
                        description="Theme for the app interface."
                    >
                        <ThemeSetting value={theme} onChange={handleThemeChange} />
                    </SettingsSectionCard>
                </div>

                <div className={styles.sectionItem} role="listitem">
                    <SettingsSectionCard
                        title="Language"
                        description="Choose your preferred language."
                    >
                        <LanguageSetting value={language} onChange={handleLanguageChange} />
                    </SettingsSectionCard>
                </div>

                <div className={styles.sectionItem} role="listitem">
                    <SettingsSectionCard
                        title="Audio"
                        description="Sound effects and autoplay."
                    >
                        <AudioSetting
                            sfxEnabled={sfxEnabled}
                            autoplayAudio={autoplayAudio}
                            onSfxChange={handleSfxChange}
                            onAutoplayChange={handleAutoplayChange}
                        />
                    </SettingsSectionCard>
                </div>

                <div className={styles.sectionItem} role="listitem">
                    <SettingsSectionCard
                        title="Notifications"
                        description="Reminders and notifications."
                    >
                        <NotificationSetting
                            dailyReminderEnabled={dailyReminderEnabled}
                            onChange={handleDailyReminderChange}
                        />
                    </SettingsSectionCard>
                </div>

                <div className={styles.sectionItem} role="listitem">
                    <SettingsSectionCard
                        title="Account"
                        description="Log out or permanently delete your account."
                    >
                        <AccountActions
                            onLogout={handleLogout}
                            onDeleteAccount={handleDeleteAccount}
                        />
                    </SettingsSectionCard>
                </div>
            </div>

            <Toast
                message={toast.message}
                variant="success"
                open={toast.open}
                onClose={closeToast}
                duration={3000}
            />
        </div>
    );
};