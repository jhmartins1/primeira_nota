import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LevelConstants } from '../../constants/LevelConstants';
import {
  getSelecao,
  setOnboardingCompleto,
  setSelecao,
} from '../../utils/onboarding';

import { styles } from './LevelScreen.styles';

const NIVEIS = LevelConstants.NIVEIS;

const ESTRELAS = ['★', '★★', '★★★'];

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
  useEffect(() => {
    getSelecao().then((selecaoSalva) => {
      setNiveis((prev) => {
        const preenchido = { ...prev };

        listaInstrumentos.forEach((instrumento) => {
          if (selecaoSalva[instrumento]) {
            preenchido[instrumento] =
              selecaoSalva[instrumento];
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
    const selecaoFinal: Record<string, string> = {};

    listaInstrumentos.forEach((instrumento) => {
      selecaoFinal[instrumento] = niveis[instrumento];
    });

    await setSelecao(selecaoFinal);
    await setOnboardingCompleto();

    router.replace('/home');
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.botaoVoltar}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.seta}>‹</Text>
            <Text style={styles.textoVoltar}>
              Voltar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.titulo}>
            Qual é o seu nível?
          </Text>

          <Text style={styles.subtitulo}>
            Selecione o nível que melhor representa sua
            experiência em cada instrumento.
          </Text>

          <View style={styles.listaInstrumentos}>
            {listaInstrumentos.map((instrumento) => (
              <View
                key={instrumento}
                style={styles.instrumentoCard}
              >
                <Text style={styles.instrumentoTitulo}>
                  {instrumento}
                </Text>

                <View style={styles.niveisContainer}>
                  {NIVEIS.map((nivel, index) => {
                    const selecionado =
                      niveis[instrumento] === nivel;

                    const estrelas =
                      ESTRELAS[index] ?? '★';

                    return (
                      <TouchableOpacity
                        key={nivel}
                        style={[
                          styles.opcao,
                          selecionado &&
                          styles.opcaoSelecionada,
                        ]}
                        onPress={() =>
                          selecionarNivel(
                            instrumento,
                            nivel
                          )
                        }
                        activeOpacity={0.8}
                      >
                        <View
                          style={
                            styles.opcaoConteudo
                          }
                        >
                          <View>
                            <Text
                              style={[
                                styles.opcaoTexto,
                                selecionado &&
                                styles.opcaoTextoSelecionado,
                              ]}
                            >
                              {nivel}
                            </Text>

                            <Text
                              style={[
                                styles.estrelas,
                                selecionado &&
                                styles.estrelasSelecionadas,
                              ]}
                            >
                              {estrelas}
                            </Text>
                          </View>

                          {selecionado && (
                            <Text
                              style={
                                styles.check
                              }
                            >
                              ✓
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Botão fixo */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.botaoContinuar,
              !podeContinuar &&
              styles.botaoDesabilitado,
            ]}
            disabled={!podeContinuar}
            onPress={handleContinuar}
            activeOpacity={0.8}
          >
            <Text style={styles.botaoTexto}>
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}