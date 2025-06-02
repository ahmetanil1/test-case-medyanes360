import prisma from '@/lib/prisma/index';

export async function getDataByUnique(tableName, where) {
    try {
        const data = await prisma[tableName].findUnique({ where: where });
        return data;
    } catch (error) {
        return { error: error.message };
    }
}

export async function createNewData(tableName, newData) {
    try {
        const data = await prisma[tableName].create({ data: newData });
        return data;
    } catch (error) {
        return { error: error.message };
    }
}

export async function getAllData(tableName) {
    try {
        const data = await prisma[tableName].findMany();
        return data;
    } catch (error) {
        return { error: error.message };
    }
}

export async function getDataByUnique(tableName, where) {
    try {
        const data = await prisma[tableName].findUnique({ where: where });
        return data;
    } catch (error) {
        return { error: error.message };
    }
}