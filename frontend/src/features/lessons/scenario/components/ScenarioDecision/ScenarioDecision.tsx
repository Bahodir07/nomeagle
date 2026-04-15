import React from 'react';
import styles from './ScenarioDecision.module.css';
import type { ScenarioStep } from '../../types';

export interface ScenarioDecisionProps {
    step: ScenarioStep;
    onChoice: (choiceId: string) => void;
}

export const ScenarioDecision: React.FC<ScenarioDecisionProps> = ({
    step,
    onChoice,
}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                {step.imageUrl && (
                    <img
                        className={styles.image}
                        src={step.imageUrl}
                        alt={step.title}
                    />
                )}

                <div className={styles.body}>
                    <p className={styles.description}>{step.description}</p>

                    <div className={styles.choices} role="group" aria-label="Choices">
                        {step.choices.map((choice) => (
                            <button
                                key={choice.id}
                                type="button"
                                className={styles.choiceBtn}
                                onClick={() => onChoice(choice.id)}
                            >
                                {choice.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
