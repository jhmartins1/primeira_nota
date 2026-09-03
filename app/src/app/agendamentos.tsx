import { Stack } from 'expo-router';
import AgendamentosScreen from '../components/Agendamentos/AgendamentosScreen';

export default function Agendamentos() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <AgendamentosScreen />
        </>
    );
}