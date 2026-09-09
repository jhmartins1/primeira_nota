import { AppError } from '../../errors/AppError';
import { prisma } from '../../prisma/client';

interface CreateDisponibilidadeDTO {
    professorId: number;
    dataInicial: string;
    horarios: string[];
    repetirProximos14Dias?: boolean;
}

const HORARIOS_PERMITIDOS = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
];

const DIAS_REPETICAO = 14;

export class CreateDisponibilidadeService {
    async execute({
        professorId,
        dataInicial,
        horarios,
        repetirProximos14Dias = false,
    }: CreateDisponibilidadeDTO) {
        if (
            !Number.isInteger(professorId) ||
            professorId <= 0
        ) {
            throw new AppError(
                'Professor inválido.',
                400
            );
        }

        if (
            typeof dataInicial !==
            'string'
        ) {
            throw new AppError(
                'Data inicial inválida.',
                400
            );
        }

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
            typeof repetirProximos14Dias !==
            'boolean'
        ) {
            throw new AppError(
                'repetirProximos14Dias deve ser boolean.',
                400
            );
        }

        if (
            !ehDataValida(
                dataInicial
            )
        ) {
            throw new AppError(
                'Data inicial inválida.',
                400
            );
        }

        const horariosInvalidos =
            horarios.filter(
                (horario) =>
                    typeof horario !==
                    'string' ||
                    !HORARIOS_PERMITIDOS.includes(
                        horario
                    )
            );

        if (
            horariosInvalidos.length >
            0
        ) {
            throw new AppError(
                'Existe um horário inválido.',
                400
            );
        }

        const horariosUnicos =
            Array.from(
                new Set(
                    horarios
                )
            );

        const registros: {
            professorId: number;
            data: Date;
            horaInicio: Date;
            horaFim: Date;
        }[] = [];

        if (
            repetirProximos14Dias
        ) {
            for (
                let deslocamento = 0;
                deslocamento <
                DIAS_REPETICAO;
                deslocamento++
            ) {
                const dataDoDia =
                    adicionarDias(
                        dataInicial,
                        deslocamento
                    );

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
            }
        } else {
            adicionarHorariosDoDia(
                registros,
                professorId,
                dataInicial,
                horariosUnicos
            );
        }

        if (
            registros.length ===
            0
        ) {
            throw new AppError(
                'Nenhum horário futuro válido foi informado.',
                400
            );
        }

        const resultado =
            await prisma.disponibilidade.createMany(
                {
                    data: registros,
                    skipDuplicates:
                        true,
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

        const fim =
            new Date(
                inicio.getTime() +
                60 *
                60 *
                1000
            );

        if (
            inicio <= agora
        ) {
            continue;
        }

        registros.push({
            professorId,
            data:
                inicio,
            horaInicio:
                inicio,
            horaFim:
                fim,
        });
    }
}

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

function adicionarDias(
    dataInicial: string,
    quantidade: number
): string {
    const partes =
        dataInicial.split(
            '-'
        );

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
        data.split(
            '-'
        );

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
        !Number.isInteger(
            ano
        ) ||
        !Number.isInteger(
            mes
        ) ||
        !Number.isInteger(
            dia
        )
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

function criarDataHoraSaoPaulo(
    data: string,
    horario: string
): Date {
    return new Date(
        `${data}T${horario}:00-03:00`
    );
}