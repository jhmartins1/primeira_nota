export function isDataDentroDoIntervaloPermitido(
    data: Date
): boolean {
    const hoje =
        new Date();

    hoje.setHours(
        0,
        0,
        0,
        0
    );

    const amanha =
        new Date(hoje);

    amanha.setDate(
        amanha.getDate() + 1
    );

    const limite =
        new Date(hoje);

    limite.setDate(
        limite.getDate() + 7
    );

    const dataComparar =
        new Date(data);

    dataComparar.setHours(
        0,
        0,
        0,
        0
    );

    return (
        dataComparar >= amanha &&
        dataComparar <= limite
    );
}