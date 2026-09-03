import { useAuth } from '@clerk/expo';
import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
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

type TipoConta = 'usuario' | 'professor';

type NiveisExistentes = Record<
  string,
  string | string[]
>;

export function LevelScreen() {
  const router = useRouter();
  const { getToken } = useAuth();

  const {
    instrumentos,
    niveisExistentes,
    modoEdicao,
    tipoConta: tipoContaParam,
  } = useLocalSearchParams<{
    instrumentos?: string;
    niveisExistentes?: string;
    modoEdicao?: string;
    tipoConta?: string;
  }>();

  const tipoConta: TipoConta =
    tipoContaParam === 'professor'
      ? 'professor'
      : 'usuario';

  /*
   * Lista de instrumentos.
   *
   * Também removemos duplicados por segurança.
   */
  const listaInstrumentos = useMemo<string[]>(() => {
    if (!instrumentos) return [];

    try {
      const parsed = JSON.parse(instrumentos);

      if (!Array.isArray(parsed)) {
        return [];
      }

      const instrumentosValidos =
        parsed.filter(
          (item): item is string =>
            typeof item === 'string'
        );

      return Array.from(
        new Set(instrumentosValidos)
      );
    } catch (error) {
      console.error(
        'Erro ao interpretar instrumentos:',
        error
      );

      return [];
    }
  }, [instrumentos]);

  const niveisIniciais =
    useMemo<NiveisExistentes>(() => {
      if (!niveisExistentes) {
        return {};
      }

      try {
        const parsed =
          JSON.parse(niveisExistentes);

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
    useState<NiveisExistentes>(
      niveisIniciais
    );

  const [salvando, setSalvando] =
    useState(false);

  function alternarNivelProfessor(
    instrumento: string,
    nivel: string
  ) {
    setNiveis((prev) => {
      const atuais = Array.isArray(
        prev[instrumento]
      )
        ? prev[instrumento]
        : prev[instrumento]
          ? [prev[instrumento] as string]
          : [];

      const jaSelecionado =
        atuais.includes(nivel);

      const novosNiveis = jaSelecionado
        ? atuais.filter(
          (item) => item !== nivel
        )
        : [...atuais, nivel];

      return {
        ...prev,
        [instrumento]: novosNiveis,
      };
    });
  }

  function selecionarNivelAluno(
    instrumento: string,
    nivel: string
  ) {
    setNiveis((prev) => ({
      ...prev,
      [instrumento]: nivel,
    }));
  }

  function nivelSelecionado(
    instrumento: string,
    nivel: string
  ) {
    const valor = niveis[instrumento];

    if (tipoConta === 'professor') {
      return (
        Array.isArray(valor) &&
        valor.includes(nivel)
      );
    }

    return valor === nivel;
  }

  /*
   * Verifica se todos os instrumentos possuem
   * pelo menos um nível.
   */
  const podeContinuar =
    listaInstrumentos.length > 0 &&
    listaInstrumentos.every((instrumento) => {
      const valor =
        niveis[instrumento];

      if (tipoConta === 'professor') {
        return (
          Array.isArray(valor) &&
          valor.length > 0
        );
      }

      return (
        typeof valor === 'string' &&
        valor.length > 0
      );
    });

  async function handleContinuar() {
    if (!podeContinuar || salvando) {
      return;
    }

    setSalvando(true);

    try {
      const selecaoFinal: {
        instrumento: string;
        nivel: string;
      }[] = [];

      for (const instrumento of listaInstrumentos) {
        const valor =
          niveis[instrumento];

        if (tipoConta === 'professor') {
          const niveisProfessor =
            Array.isArray(valor)
              ? valor
              : valor
                ? [valor]
                : [];

          for (const nivel of niveisProfessor) {
            selecaoFinal.push({
              instrumento,
              nivel,
            });
          }
        } else {
          if (typeof valor === 'string') {
            selecaoFinal.push({
              instrumento,
              nivel: valor,
            });
          }
        }
      }

      const token = await getToken();

      if (!token) {
        throw new Error(
          'Token não encontrado'
        );
      }

      const endpoint =
        tipoConta === 'professor'
          ? '/professor/instrumentos'
          : '/usuario/instrumentos';

      const API_URL =
        process.env.EXPO_PUBLIC_API_URL;

      if (!API_URL) {
        throw new Error(
          'EXPO_PUBLIC_API_URL não configurada.'
        );
      }

      const response = await fetch(
        `${API_URL}${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Authorization:
              `Bearer ${token}`,
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

      try {
        JSON.parse(texto);
      } catch {
        throw new Error(
          `Backend não retornou JSON: ${texto}`
        );
      }

      if (tipoConta === 'professor') {
        router.replace('/professor');
      } else {
        router.replace('/home');
      }
    } catch (error) {
      console.error(
        `Erro ao salvar instrumentos do ${tipoConta}:`,
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
        edges={[
          'top',
          'bottom',
        ]}
      >
        <View
          style={styles.container}
        >
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
                style={styles.seta}
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
              paddingHorizontal: 24,
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
                router.replace({
                  pathname:
                    '/instrument',
                  params: {
                    modoEdicao:
                      modoEdicao ??
                      'false',
                    tipoConta,
                  },
                })
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
      edges={[
        'top',
        'bottom',
      ]}
    >
      <View
        style={styles.container}
      >
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
            <Text
              style={styles.seta}
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

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >
          <Text
            style={styles.titulo}
          >
            Qual é o seu nível?
          </Text>

          <Text
            style={styles.subtitulo}
          >
            {tipoConta ===
              'professor'
              ? 'Selecione um ou mais níveis de experiência em cada instrumento que você ensina.'
              : 'Selecione o nível que melhor representa sua experiência em cada instrumento.'}
          </Text>

          <View
            style={
              styles.listaInstrumentos
            }
          >
            {listaInstrumentos.map(
              (instrumento) => (
                <View
                  key={instrumento}
                  style={
                    styles.instrumentoCard
                  }
                >
                  <Text
                    style={
                      styles.instrumentoTitulo
                    }
                  >
                    {instrumento}
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
                          nivelSelecionado(
                            instrumento,
                            nivel
                          );

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
                            onPress={() => {
                              if (
                                tipoConta ===
                                'professor'
                              ) {
                                alternarNivelProfessor(
                                  instrumento,
                                  nivel
                                );
                              } else {
                                selecionarNivelAluno(
                                  instrumento,
                                  nivel
                                );
                              }
                            }}
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

        <View
          style={styles.footer}
        >
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