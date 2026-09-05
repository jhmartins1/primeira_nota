import type {
    Request,
    Response,
} from 'express';

import { prisma } from '../../prisma/client';

const HORARIOS_PERMITIDOS = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
];

const DIAS_REPETICAO = 14;

export class CreateDisponibilidadeController {
    async handle(
        req: Request,
        res: Response
    ) {
        try {
            if (
                req.tipoConta !==
                'professor' ||
                !req.professorId
            ) {
                return res
                    .status(403)
                    .json({
                        error:
                            'Acesso restrito a professores.',
                    });
            }

            const {
                dataInicial,
                horarios,
                repetirProximos14Dias =
                false,
            } = req.body;

            if (
                typeof dataInicial !==
                'string' ||
                !Array.isArray(
                    horarios
                ) ||
                horarios.length ===
                0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'dataInicial e horarios são obrigatórios.',
                    });
            }

            if (
                typeof repetirProximos14Dias !==
                'boolean'
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'repetirProximos14Dias deve ser boolean.',
                    });
            }

            if (
                !ehDataValida(
                    dataInicial
                )
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'Data inicial inválida.',
                    });
            }

            const horariosInvalidos =
                horarios.filter(
                    (
                        horario:
                            unknown
                    ) =>
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
                return res
                    .status(400)
                    .json({
                        error:
                            'Existe um horário inválido.',
                    });
            }

            const horariosUnicos =
                Array.from(
                    new Set(
                        horarios as string[]
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
                    let deslocamento =
                        0;
                    deslocamento <
                    DIAS_REPETICAO;
                    deslocamento++
                ) {
                    const dataDoDia =
                        adicionarDias(
                            dataInicial,
                            deslocamento
                        );

                    /*
                     * Mantém sua regra:
                     * repetição somente
                     * segunda a sexta.
                     */
                    if (
                        !ehDiaUtil(
                            dataDoDia
                        )
                    ) {
                        continue;
                    }

                    adicionarHorariosDoDia(
                        registros,
                        req.professorId,
                        dataDoDia,
                        horariosUnicos
                    );
                }
            } else {
                adicionarHorariosDoDia(
                    registros,
                    req.professorId,
                    dataInicial,
                    horariosUnicos
                );
            }

            if (
                registros.length ===
                0
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            'Nenhum horário futuro válido foi informado.',
                    });
            }

            const resultado =
                await prisma.disponibilidade.createMany(
                    {
                        data:
                            registros,

                        skipDuplicates:
                            true,
                    }
                );

            return res
                .status(201)
                .json({
                    message:
                        'Horários adicionados com sucesso.',

                    quantidadeCriada:
                        resultado.count,

                    quantidadeSolicitada:
                        registros.length,
                });
        } catch (error) {
            console.error(
                'Erro ao criar disponibilidades:',
                error
            );

            if (
                error instanceof Error
            ) {
                return res
                    .status(400)
                    .json({
                        error:
                            error.message,
                    });
            }

            return res
                .status(500)
                .json({
                    error:
                        'Erro interno ao criar disponibilidades.',
                });
        }
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
        dataInicial.split('-');

    if (
        partes.length !== 3
    ) {
        throw new Error(
            'Data inicial inválida.'
        );
    }

    const ano =
        Number(partes[0]);

    const mes =
        Number(partes[1]);

    const dia =
        Number(partes[2]);

    if (
        Number.isNaN(ano) ||
        Number.isNaN(mes) ||
        Number.isNaN(dia)
    ) {
        throw new Error(
            'Data inicial inválida.'
        );
    }

    const data =
        new Date(
            ano,
            mes - 1,
            dia,
            12,
            0,
            0,
            0
        );

    data.setDate(
        data.getDate() +
        quantidade
    );

    const novoAno =
        data.getFullYear();

    const novoMes =
        String(
            data.getMonth() +
            1
        ).padStart(
            2,
            '0'
        );

    const novoDia =
        String(
            data.getDate()
        ).padStart(
            2,
            '0'
        );

    return `${novoAno}-${novoMes}-${novoDia}`;
}

function ehDataValida(
    data: string
): boolean {
    const partes =
        data.split('-');

    if (
        partes.length !== 3
    ) {
        return false;
    }

    const ano =
        Number(partes[0]);

    const mes =
        Number(partes[1]);

    const dia =
        Number(partes[2]);

    if (
        Number.isNaN(ano) ||
        Number.isNaN(mes) ||
        Number.isNaN(dia)
    ) {
        return false;
    }

    const teste =
        new Date(
            ano,
            mes - 1,
            dia,
            12,
            0,
            0,
            0
        );

    return (
        teste.getFullYear() ===
        ano &&
        teste.getMonth() ===
        mes - 1 &&
        teste.getDate() ===
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