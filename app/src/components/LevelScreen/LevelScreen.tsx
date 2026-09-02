import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
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

  const { instrumentos } = useLocalSearchParams<{
    instrumentos?: string;
  }>();

  /**
   * Converte os instrumentos recebidos pela rota
   * em um array de strings.
   */
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
        (item): item is string => typeof item === 'string'
      );
    } catch (error) {
      console.error(
        'Erro ao interpretar instrumentos:',
        error
      );

      return [];
    }
  }, [instrumentos]);

  /**
   * Guarda o nível selecionado para cada instrumento.
   *
   * Exemplo:
   *
   * {
   *   Violão: 'Iniciante',
   *   Guitarra: 'Intermediário'
   * }
   */
  const [niveis, setNiveis] =
    useState<Record<string, string>>({});

  /**
   * Seleciona o nível de um instrumento.
   */
  function selecionarNivel(
    instrumento: string,
    nivel: string
  ) {
    setNiveis((prev) => ({
      ...prev,
      [instrumento]: nivel,
    }));
  }

  /**
   * Verifica se todos os instrumentos possuem
   * um nível selecionado.
   */
  const podeContinuar =
    listaInstrumentos.length > 0 &&
    listaInstrumentos.every(
      (instrumento) => Boolean(niveis[instrumento])
    );

  /**
   * Finaliza a seleção dos níveis.
   */
  function handleContinuar() {
    if (!podeContinuar) {
      return;
    }

    const selecaoFinal: Record<string, string> = {};

    listaInstrumentos.forEach((instrumento) => {
      const nivel = niveis[instrumento];

      if (nivel) {
        selecaoFinal[instrumento] = nivel;
      }
    });

    console.log(
      'Instrumentos e níveis selecionados:',
      selecaoFinal
    );

    /**
     * Por enquanto enviamos os dados pela navegação.
     *
     * Posteriormente esses dados serão enviados
     * para o backend usando o user.id do Clerk.
     */
    router.replace({
      pathname: '/home',
      params: {
        selecao: JSON.stringify(selecaoFinal),
      },
    });
  }

  /**
   * Caso não existam instrumentos recebidos,
   * volta para a tela de instrumentos.
   */
  if (listaInstrumentos.length === 0) {
    return (
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'bottom']}
      >
        <View style={styles.container}>
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

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 24,
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
              }}
            >
              Nenhum instrumento foi selecionado.
            </Text>

            <TouchableOpacity
              onPress={() => router.replace('/instrument')}
              style={{
                marginTop: 20,
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Selecionar instrumentos
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
                          style={styles.opcaoConteudo}
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
                              style={styles.check}
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