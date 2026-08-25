import { Stack } from 'expo-router';
import { AgendamentoScreen } from '../components/Agendamento/AgendamentoScreen';

export default function Agendamento() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <AgendamentoScreen />
        </>
    );
}