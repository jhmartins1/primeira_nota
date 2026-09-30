import { AppError } from '../../errors/AppError';
import { prisma } from '../../prisma/client';

interface CreateDisponibilidadeDTO {
    professorId: number;
    dataInicial: string;
    horarios: string[];
    repetirSeteDiasUteis?: boolean;
}

const QUANTIDADE_DIAS_UTEIS = 7;

export class CreateDisponibilidadeService {
    async execute({
        professorId,
        dataInicial,
        horarios,
        repetirSeteDiasUteis = false,
    }: CreateDisponibilidadeDTO) {
        // ----------------------------------------------------
        // PROFESSOR
        // ----------------------------------------------------

        if (
            !Number.isInteger(professorId) ||
            professorId <= 0
        ) {
            throw new AppError(
                'Professor inválido.',
                400
            );
        }

        // ----------------------------------------------------
        // DATA
        // ----------------------------------------------------

        if (
            typeof dataInicial !== 'string' ||
            !ehDataValida(dataInicial)
        ) {
            throw new AppError(
                'Data inicial inválida.',
                400
            );
        }

        // ----------------------------------------------------
        // HORÁRIOS
        // ----------------------------------------------------

        if (
            !Array.isArray(horarios) ||
            horarios.length === 0
        ) {
            throw new AppError(
                'Informe pelo menos um horário.',
                400
            );
        }

        if (
            typeof repetirSeteDiasUteis !==
            'boolean'
        ) {
            throw new AppError(
                'repetirSeteDiasUteis deve ser boolean.',
                400
            );
        }

        // ----------------------------------------------------
        // VALIDAR QUALQUER HORÁRIO HH:mm
        //
        // Exemplos válidos:
        // 06:40
        // 10:40
        // 14:15
        // 20:00
        // 23:55
        // ----------------------------------------------------

        const horariosInvalidos =
            horarios.filter(
                (horario) =>
                    typeof horario !==
                    'string' ||
                    !ehHorarioValido(
                        horario
                    )
            );

        if (
            horariosInvalidos.length > 0
        ) {
            throw new AppError(
                'Existe um horário inválido. Use o formato HH:mm.',
                400
            );
        }

        // Remove horários repetidos.
        //
        // Exemplo:
        // ['10:40', '10:40', '14:00']
        //
        // vira:
        // ['10:40', '14:00']

        const horariosUnicos =
            Array.from(
                new Set(horarios)
            ).sort();

        const registros: {
            professorId: number;
            data: Date;
            horaInicio: Date;
            horaFim: Date;
        }[] = [];

        // ----------------------------------------------------
        // REPETIR NOS PRÓXIMOS 7 DIAS ÚTEIS
        // ----------------------------------------------------

        if (repetirSeteDiasUteis) {
            let diasUteisAdicionados =
                0;

            let deslocamento = 0;

            while (
                diasUteisAdicionados <
                QUANTIDADE_DIAS_UTEIS
            ) {
                const dataDoDia =
                    adicionarDias(
                        dataInicial,
                        deslocamento
                    );

                deslocamento++;

                if (
                    !ehDiaUtil(
                        dataDoDia
                    )
                ) {
                    continue;
                }

                adicionarHorariosDoDia(
                    registros,
                    professorId,
                    dataDoDia,
                    horariosUnicos
                );

                diasUteisAdicionados++;
            }
        } else {
            // ------------------------------------------------
            // SOMENTE O DIA SELECIONADO
            // ------------------------------------------------

            adicionarHorariosDoDia(
                registros,
                professorId,
                dataInicial,
                horariosUnicos
            );
        }

        // ----------------------------------------------------
        // NENHUM HORÁRIO FUTURO
        // ----------------------------------------------------

        if (
            registros.length === 0
        ) {
            throw new AppError(
                'Nenhum horário futuro válido foi informado.',
                400
            );
        }

        // ----------------------------------------------------
        // CRIAR DISPONIBILIDADES
        // ----------------------------------------------------

        const resultado =
            await prisma.disponibilidade.createMany(
                {
                    data: registros,

                    // Caso exatamente o mesmo horário
                    // já exista, não duplica.
                    skipDuplicates: true,
                }
            );

        return {
            message:
                'Horários adicionados com sucesso.',

            quantidadeCriada:
                resultado.count,

            quantidadeSolicitada:
                registros.length,
        };
    }
}

// ============================================================
// ADICIONAR HORÁRIOS
// ============================================================

function adicionarHorariosDoDia(
    registros: {
        professorId: number;
        data: Date;
        horaInicio: Date;
        horaFim: Date;
    }[],
    professorId: number,
    data: string,
    horarios: string[]
) {
    const agora =
        new Date();

    for (
        const horario of horarios
    ) {
        const inicio =
            criarDataHoraSaoPaulo(
                data,
                horario
            );

        /*
         * Por enquanto horaFim continua sendo
         * preenchida porque seu model de
         * Disponibilidade possui esse campo.
         *
         * IMPORTANTE:
         * horaFim NÃO está sendo usada para
         * impedir outros horários próximos.
         *
         * Portanto:
         *
         * 10:00
         * 10:30
         * 10:40
         * 11:00
         *
         * podem coexistir.
         *
         * Quando você implementar duração da aula,
         * podemos fazer horaFim refletir a duração
         * real escolhida.
         */
        const fim =
            new Date(
                inicio.getTime() +
                60 * 60 * 1000
            );

        // Horários passados são ignorados.
        if (
            inicio <= agora
        ) {
            continue;
        }

        registros.push({
            professorId,
            data: inicio,
            horaInicio: inicio,
            horaFim: fim,
        });
    }
}

// ============================================================
// VALIDAR HORÁRIO
// ============================================================

function ehHorarioValido(
    horario: string
): boolean {
    // Exige HH:mm.
    //
    // Exemplos:
    // 06:40
    // 10:00
    // 20:15

    if (
        !/^\d{2}:\d{2}$/.test(
            horario
        )
    ) {
        return false;
    }

    const partes =
        horario.split(':');

    const horaTexto =
        partes[0];

    const minutoTexto =
        partes[1];

    if (
        horaTexto === undefined ||
        minutoTexto === undefined
    ) {
        return false;
    }

    const hora =
        Number(
            horaTexto
        );

    const minuto =
        Number(
            minutoTexto
        );

    return (
        Number.isInteger(hora) &&
        Number.isInteger(minuto) &&
        hora >= 0 &&
        hora <= 23 &&
        minuto >= 0 &&
        minuto <= 59
    );
}

// ============================================================
// DIA ÚTIL
// ============================================================

function ehDiaUtil(
    data: string
): boolean {
    const dataReferencia =
        new Date(
            `${data}T12:00:00-03:00`
        );

    const diaSemana =
        dataReferencia.getDay();

    return (
        diaSemana >= 1 &&
        diaSemana <= 5
    );
}

// ============================================================
// ADICIONAR DIAS
// ============================================================

function adicionarDias(
    dataInicial: string,
    quantidade: number
): string {
    const partes =
        dataInicial.split('-');

    if (
        partes.length !== 3
    ) {
        throw new AppError(
            'Data inicial inválida.',
            400
        );
    }

    const ano =
        Number(
            partes[0]
        );

    const mes =
        Number(
            partes[1]
        );

    const dia =
        Number(
            partes[2]
        );

    if (
        Number.isNaN(ano) ||
        Number.isNaN(mes) ||
        Number.isNaN(dia)
    ) {
        throw new AppError(
            'Data inicial inválida.',
            400
        );
    }

    const dataUTC =
        new Date(
            Date.UTC(
                ano,
                mes - 1,
                dia,
                12,
                0,
                0
            )
        );

    dataUTC.setUTCDate(
        dataUTC.getUTCDate() +
        quantidade
    );

    const novoAno =
        dataUTC.getUTCFullYear();

    const novoMes =
        String(
            dataUTC.getUTCMonth() +
            1
        ).padStart(
            2,
            '0'
        );

    const novoDia =
        String(
            dataUTC.getUTCDate()
        ).padStart(
            2,
            '0'
        );

    return `${novoAno}-${novoMes}-${novoDia}`;
}

// ============================================================
// VALIDAR DATA
// ============================================================

function ehDataValida(
    data: string
): boolean {
    if (
        !/^\d{4}-\d{2}-\d{2}$/.test(
            data
        )
    ) {
        return false;
    }

    const partes =
        data.split('-');

    const anoTexto =
        partes[0];

    const mesTexto =
        partes[1];

    const diaTexto =
        partes[2];

    if (
        !anoTexto ||
        !mesTexto ||
        !diaTexto
    ) {
        return false;
    }

    const ano =
        Number(
            anoTexto
        );

    const mes =
        Number(
            mesTexto
        );

    const dia =
        Number(
            diaTexto
        );

    if (
        !Number.isInteger(ano) ||
        !Number.isInteger(mes) ||
        !Number.isInteger(dia)
    ) {
        return false;
    }

    const teste =
        new Date(
            Date.UTC(
                ano,
                mes - 1,
                dia,
                12,
                0,
                0
            )
        );

    return (
        teste.getUTCFullYear() ===
        ano &&
        teste.getUTCMonth() ===
        mes - 1 &&
        teste.getUTCDate() ===
        dia
    );
}

// ============================================================
// CRIAR DATA/HORA NO FUSO DE SÃO PAULO
// ============================================================

function criarDataHoraSaoPaulo(
    data: string,
    horario: string
): Date {
    return new Date(
        `${data}T${horario}:00-03:00`
    );
}