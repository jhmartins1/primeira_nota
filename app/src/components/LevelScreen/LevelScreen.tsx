import { useAuth } from '@clerk/expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LevelConstants } from '../../constants/LevelConstants';
import { styles } from './LevelScreen.styles';

const NIVEIS = LevelConstants.NIVEIS;
const ESTRELAS = ['★', '★★', '★★★'];

export function LevelScreen() {
  const router = useRouter();
  const { getToken } = useAuth();

  const {
    instrumentos,
    niveisExistentes,
    modoEdicao,
  } = useLocalSearchParams<{
    instrumentos?: string;
    niveisExistentes?: string;
    modoEdicao?: string;
  }>();

  const listaInstrumentos = useMemo<string[]>(() => {
    if (!instrumentos) {
      return [];
    }

    try {
      const parsed = JSON.parse(instrumentos);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.filter(
        (item): item is string =>
          typeof item === 'string'
      );
    } catch (error) {
      console.error(
        'Erro ao interpretar instrumentos:',
        error
      );

      return [];
    }
  }, [instrumentos]);

  const niveisIniciais = useMemo<
    Record<string, string>
  >(() => {
    if (!niveisExistentes) {
      return {};
    }

    try {
      const parsed = JSON.parse(niveisExistentes);

      if (
        !parsed ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed)
      ) {
        return {};
      }

      return parsed;
    } catch (error) {
      console.error(
        'Erro ao interpretar níveis existentes:',
        error
      );

      return {};
    }
  }, [niveisExistentes]);

  const [niveis, setNiveis] =
    useState<Record<string, string>>(
      niveisIniciais
    );

  const [salvando, setSalvando] =
    useState(false);

  function selecionarNivel(
    instrumento: string,
    nivel: string
  ) {
    setNiveis((prev) => ({
      ...prev,
      [instrumento]: nivel,
    }));
  }

  const podeContinuar =
    listaInstrumentos.length > 0 &&
    listaInstrumentos.every(
      (instrumento) =>
        Boolean(niveis[instrumento])
    );

  async function handleContinuar() {
    if (!podeContinuar || salvando) {
      return;
    }

    setSalvando(true);

    try {
      const selecaoFinal =
        listaInstrumentos.map(
          (instrumento) => ({
            instrumento,
            nivel: niveis[instrumento],
          })
        );

      const token = await getToken();

      if (!token) {
        throw new Error(
          'Token não encontrado'
        );
      }

      const response = await fetch(
        'http://10.0.2.2:3333/usuario/instrumentos',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            instrumentos:
              selecaoFinal,
          }),
        }
      );

      const texto =
        await response.text();

      if (!response.ok) {
        throw new Error(
          `Erro ${response.status}: ${texto}`
        );
      }

      let data;

      try {
        data = JSON.parse(texto);
      } catch {
        throw new Error(
          `Backend não retornou JSON: ${texto}`
        );
      }

      router.replace('/home');
    } catch (error) {
      console.error(
        'Erro ao salvar instrumentos:',
        error
      );
    } finally {
      setSalvando(false);
    }
  }

  if (listaInstrumentos.length === 0) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'bottom']}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={
                styles.botaoVoltar
              }
              onPress={() =>
                router.back()
              }
              activeOpacity={0.7}
            >
              <Text
                style={
                  styles.seta
                }
              >
                ‹
              </Text>

              <Text
                style={
                  styles.textoVoltar
                }
              >
                Voltar
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent:
                'center',
              alignItems:
                'center',
              paddingHorizontal:
                24,
            }}
          >
            <Text
              style={{
                textAlign:
                  'center',
                fontSize: 16,
              }}
            >
              Nenhum instrumento foi
              selecionado.
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.replace(
                  '/instrument'
                )
              }
              style={{
                marginTop: 20,
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight:
                    '600',
                }}
              >
                Selecionar
                instrumentos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'bottom']}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={
              styles.botaoVoltar
            }
            onPress={() =>
              router.back()
            }
            activeOpacity={0.7}
            disabled={salvando}
          >
            <Text style={styles.seta}>
              ‹
            </Text>

            <Text
              style={
                styles.textoVoltar
              }
            >
              Voltar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >
          <Text style={styles.titulo}>
            Qual é o seu nível?
          </Text>

          <Text
            style={
              styles.subtitulo
            }
          >
            Selecione o nível que melhor
            representa sua experiência em
            cada instrumento.
          </Text>

          <View
            style={
              styles.listaInstrumentos
            }
          >
            {listaInstrumentos.map(
              (instrumento) => (
                <View
                  key={
                    instrumento
                  }
                  style={
                    styles.instrumentoCard
                  }
                >
                  <Text
                    style={
                      styles.instrumentoTitulo
                    }
                  >
                    {
                      instrumento
                    }
                  </Text>

                  <View
                    style={
                      styles.niveisContainer
                    }
                  >
                    {NIVEIS.map(
                      (
                        nivel,
                        index
                      ) => {
                        const selecionado =
                          niveis[
                          instrumento
                          ] ===
                          nivel;

                        const estrelas =
                          ESTRELAS[
                          index
                          ] ??
                          '★';

                        return (
                          <TouchableOpacity
                            key={
                              nivel
                            }
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
                            activeOpacity={
                              0.8
                            }
                            disabled={
                              salvando
                            }
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
                                  {
                                    nivel
                                  }
                                </Text>

                                <Text
                                  style={[
                                    styles.estrelas,
                                    selecionado &&
                                    styles.estrelasSelecionadas,
                                  ]}
                                >
                                  {
                                    estrelas
                                  }
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
                      }
                    )}
                  </View>
                </View>
              )
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.botaoContinuar,
              (!podeContinuar ||
                salvando) &&
              styles.botaoDesabilitado,
            ]}
            disabled={
              !podeContinuar ||
              salvando
            }
            onPress={
              handleContinuar
            }
            activeOpacity={0.8}
          >
            {salvando ? (
              <ActivityIndicator
                color="#fff"
              />
            ) : (
              <Text
                style={
                  styles.botaoTexto
                }
              >
                {modoEdicao ===
                  'true'
                  ? 'Salvar alterações'
                  : 'Continuar'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}