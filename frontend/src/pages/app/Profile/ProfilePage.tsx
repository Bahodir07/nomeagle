import React, { useCallback, useEffect, useState } from 'react';
import { ErrorState } from '../../../components/feedback';
import { Skeleton } from '../../../components/ui/Skeleton';
import {
  ProfileHeader,
  ProfileBasicsForm,
  LearningPreferencesForm,
  SecurityCard,
  ProfileStatsCard,
} from '../../../features/profile/components';
import {
  getProfile,
  updateProfileBasics,
  updateProfilePreferences,
  updateProfilePassword,
  uploadAvatar,
} from '../../../app/api/profile';
import type { UserProfile } from '../../../features/profile/types';
import type { AsyncState } from '../../../features/dashboard/types';
import styles from './ProfilePage.module.css';

export const ProfilePage: React.FC = () => {
  const [state, setState] = useState<AsyncState<UserProfile>>({
    status: 'loading',
  });

  const loadProfile = useCallback(() => {
    setState({ status: 'loading' });
    getProfile()
      .then((data) => setState({ status: 'success', data }))
      .catch((err) => setState({ status: 'error', error: String(err) }));
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  /* ---- Loading ---- */
  if (state.status === 'loading' || state.status === 'idle') {
    return (
      <div className={styles.wrap}>
        <Skeleton
          variant="rect"
          className={styles.skeletonHeader}
          aria-hidden
        />
        <div className={styles.skeletonGrid}>
          <div className={styles.skeletonLeft}>
            <Skeleton variant="rect" className={styles.skeletonCard} />
            <Skeleton variant="rect" className={styles.skeletonCard} />
            <Skeleton variant="rect" className={styles.skeletonCardSmall} />
          </div>
          <Skeleton variant="rect" className={styles.skeletonSide} />
        </div>
        <span className={styles.srOnly} aria-live="polite">
          Loading profile, please wait...
        </span>
      </div>
    );
  }

  /* ---- Error ---- */
  if (state.status === 'error') {
    return (
      <div className={styles.wrap}>
        <h1 className={styles.title}>Profile</h1>
        <ErrorState
          message={state.error}
          onRetry={loadProfile}
          retryLabel="Try again"
        />
      </div>
    );
  }

  /* ---- Success ---- */
  const profile = state.data;

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Profile</h1>

      <div className={styles.grid}>
        <section className={styles.left} aria-label="Profile forms">
          <ProfileBasicsForm
            displayName={profile.displayName}
            email={profile.email}
            bio={profile.bio}
            onSave={(payload) => {
              updateProfileBasics(payload).then(loadProfile);
            }}
          />
          <LearningPreferencesForm
            selectedCountries={profile.selectedCountries}
            interests={profile.interests}
            difficulty={profile.difficulty}
            onSave={(payload) => {
              updateProfilePreferences(payload);
            }}
          />
          <SecurityCard
            onUpdatePassword={({ currentPassword, newPassword }) => {
              updateProfilePassword({
                currentPassword,
                newPassword,
                newPassword_confirmation: newPassword,
              });
            }}
          />
        </section>

        <aside className={styles.right} aria-label="Profile and statistics">
          <ProfileHeader
            className={styles.headerInColumn}
            displayName={profile.displayName}
            subtitle={profile.email}
            avatarUrl={profile.avatarUrl}
            onAvatarUpload={(file) => {
              uploadAvatar(file).then(loadProfile);
            }}
          />
          <ProfileStatsCard
            level={profile.level}
            xp={profile.xp}
            streakDays={profile.streakDays}
            selectedCountriesCount={profile.selectedCountries.length}
          />
        </aside>
      </div>
    </div>
  );
};
