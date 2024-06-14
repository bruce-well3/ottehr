import { DateTime } from 'luxon';
import { useMutation, useQuery } from 'react-query';
import { ZapEHRAPIClient } from 'ottehr-components';
import { useIntakeCommonStore } from '../common';
import { usePatientInfoStore } from '../patient-info';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useCreateAppointmentMutation = () =>
  useMutation({
    mutationFn: ({
      apiClient,
      unconfirmedDateOfBirth,
    }: {
      apiClient: ZapEHRAPIClient;
      unconfirmedDateOfBirth?: string;
    }) => {
      // const appointment = AppointmentStore.getState();
      const patientInfo = usePatientInfoStore.getState();
      const intakeCommon = useIntakeCommonStore.getState();

      return apiClient.createAppointment({
        // slot: intakeCommon.visitType === VisitType.WalkIn ? undefined : appointment.appointmentSlot,
        patient: patientInfo.patientInfo,
        timezone: DateTime.now().zoneName,
        locationState: intakeCommon.selectedLocationState,
        ...(unconfirmedDateOfBirth && { unconfirmedDateOfBirth }),
      });
    },
  });

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useCancelAppointmentMutation = () =>
  useMutation({
    mutationFn: ({
      apiClient,
      appointmentID,
      cancellationReason,
    }: {
      apiClient: ZapEHRAPIClient;
      appointmentID: string;
      cancellationReason: string;
    }) => {
      return apiClient.cancelAppointment({
        appointmentID,
        cancellationReason,
      });
    },
  });

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useGetAppointments = (apiClient: ZapEHRAPIClient | null, enabled = true, patientId?: string) =>
  useQuery(
    ['appointments', patientId],
    () => {
      if (!apiClient) {
        throw new Error('API client not defined');
      }
      return patientId ? apiClient.getAppointments({ patientId }) : apiClient.getAppointments();
    },
    {
      enabled,
      onError: (err) => {
        console.error('Error during fetching appointments: ', err);
      },
      staleTime: 1000 * 60 * 5,
    },
  );

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useGetTelemedStates = (apiClient: ZapEHRAPIClient | null, enabled = true) =>
  useQuery(
    ['telemed-states'],
    () => {
      if (!apiClient) {
        throw new Error('API client not defined');
      }
      return apiClient.getTelemedStates();
    },
    {
      enabled,
      onError: (err) => {
        console.error('Error during fetching telemed states: ', err);
      },
    },
  );
