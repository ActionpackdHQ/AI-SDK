import type { z } from 'zod';
import { Provider, FlowStep, FlowError } from './types';
import { serverCompose } from './compose';
import { logger } from './utils/logger';

/**
 * Builder for creating multi-step flows
 */
export class FlowBuilder {
  private steps: FlowStep[] = [];
  private results: Record<string, unknown> = {};
  private currentStepIndex = 0;

  /**
   * Get the current step index
   */
  getCurrentStep(): number {
    return this.currentStepIndex;
  }

  constructor(private provider: Provider) {}

  /**
   * Add a step to the flow
   */
  addStep(step: FlowStep): this {
    this.steps.push(step);
    return this;
  }

  /**
   * Add multiple steps
   */
  addSteps(steps: FlowStep[]): this {
    this.steps.push(...steps);
    return this;
  }

  /**
   * Get results from previous steps
   */
  getResults(): Record<string, unknown> {
    return { ...this.results };
  }

  /**
   * Execute all steps in sequence
   */
  async execute(): Promise<Record<string, unknown>> {
    for (let i = 0; i < this.steps.length; i++) {
      try {
        await this.executeStep(i);
      } catch (e) {
        const error = e as Error;
        throw new FlowError(
          `Error in step ${i + 1}: ${error.message}`,
          i + 1
        );
      }
    }
    return this.results;
  }

  /**
   * Execute a specific step
   */
  private async executeStep(stepIndex: number): Promise<void> {
    const step = this.steps[stepIndex];
    this.currentStepIndex = stepIndex;

    logger.debug(`Executing flow step ${stepIndex + 1}`);

    const result = await serverCompose(
      this.provider,
      step.prompt,
      {
        variables: {
          ...step.variables,
          results: this.results,
        },
        schema: step.schema as z.ZodType<unknown>,
        retries: step.retries || 0,
        temperature: 0.7
      }
    );

    // Store result with step index as key
    this.results[`step${stepIndex + 1}`] = result;
  }

  /**
   * Reset the flow
   */
  reset(): this {
    this.results = {};
    this.currentStepIndex = 0;
    return this;
  }
}

/**
 * Create a new flow builder
 */
export function flowBuilder(provider: Provider): FlowBuilder {
  return new FlowBuilder(provider);
}
