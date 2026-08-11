import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { LevelConstants } from '../../constants/LevelConstants';
import { getSelecao, setOnboardingCompleto, setSelecao } from '../../utils/onboarding';
import { styles } from './LevelScreen.styles';

const NIVEIS = LevelConstants.NIVEIS;

export function LevelScreen() {
  const router = useRouter();

  const { instrumentos } = useLocalSearchParams<{
    instrumentos: string;
  }>();

  const listaInstrumentos = useMemo<string[]>(() => {
    if (!instrumentos) return [];

    try {
      return JSON.parse(instrumentos) as string[];
    } catch {
      return [];
    }
  }, [instrumentos]);

  const [niveis, setNiveis] = useState<Record<string, string>>({});

  // Pré-preenche os níveis dos instrumentos que já tinham nível escolhido
  // (fluxo de edição vindo da Home)
  useEffect(() => {
    getSelecao().then((selecaoSalva) => {
      setNiveis((prev) => {
        const preenchido = { ...prev };
        listaInstrumentos.forEach((instrumento) => {
          if (selecaoSalva[instrumento]) {
            preenchido[instrumento] = selecaoSalva[instrumento];
          }
        });
        return preenchido;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selecionarNivel(instrumento: string, nivel: string) {
    setNiveis((prev) => ({
      ...prev,
      [instrumento]: nivel,
    }));
  }

  const podeContinuar =
    listaInstrumentos.length > 0 &&
    listaInstrumentos.every((instrumento) => niveis[instrumento]);

  async function handleContinuar() {
    // Mantém só os instrumentos que ainda estão selecionados
    const selecaoFinal: Record<string, string> = {};
    listaInstrumentos.forEach((instrumento) => {
      selecaoFinal[instrumento] = niveis[instrumento];
    });

    await setSelecao(selecaoFinal);
    await setOnboardingCompleto();

    router.replace('/home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.seta}>←</Text>
          <Text style={styles.textoVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <Text style={styles.pergunta}>
          Qual é o seu nível em cada instrumento?
        </Text>

        <View style={styles.listaInstrumentos}>
          {listaInstrumentos.map((instrumento) => (
            <View key={instrumento} style={styles.instrumentoCard}>
              <Text style={styles.instrumentoTitulo}>
                {instrumento}
              </Text>

              {NIVEIS.map((nivel) => {
                const selecionado = niveis[instrumento] === nivel;

                return (
                  <TouchableOpacity
                    key={nivel}
                    style={[
                      styles.opcao,
                      selecionado && styles.opcaoSelecionada,
                    ]}
                    onPress={() => selecionarNivel(instrumento, nivel)}
                  >
                    <Text
                      style={[
                        styles.opcaoTexto,
                        selecionado && styles.opcaoTextoSelecionado,
                      ]}
                    >
                      {nivel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          <TouchableOpacity
            style={[
              styles.botaoContinuar,
              !podeContinuar && styles.botaoDesabilitado,
            ]}
            disabled={!podeContinuar}
            onPress={handleContinuar}
          >
            <Text style={styles.botaoTexto}>
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}