import prisma from '@/lib/prisma';

export async function getDataByUnique(tableName, where) {
    try {
        const data = await prisma[tableName].findUnique({ where: where });
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

export async function createNewData(tableName, newData) {
    try {
        console.log("createe new data içinde");
        const data = await prisma[tableName].create({ data: newData });
        console.log("data", data);
        return data;
    } catch (error) {
        return { error: error.message };
    }
}

export async function createNewDataMany(tableName, newDatas) {
    try {
        const data = await prisma[tableName].createMany({ data: newDatas });
        return data;
    } catch (error) {
        console.error(`Error in createNewDataMany for ${tableName}:`, error);
        return { error: error.message || "Unknown error in createNewDataMany" };
    }
}

export async function updateDataByAny(tableName, where, data) {
    try {
        const updatedData = await prisma[tableName].update({
            where: where,
            data: data
        });
        return updatedData;
    } catch (error) {
        console.error(`Error in updateDataByAny for ${tableName}:`, error);
        return { error: error.message || "Unknown error in updateDataByAny" };
    }
}

export async function deleteDataByAny(tableName, where) {
    try {
        const deletedData = await prisma[tableName].delete({ where: where });
        return deletedData;
    } catch (error) {
        console.error(`Error in deleteDataByAny for ${tableName}:`, error);
        if (error.code === 'P2025') {
            return { error: "Record to delete not found." };
        }
        return { error: error.message || "Unknown error in deleteDataByAny" };
    }
}
export async function deleteDataAll(tableName, where = {}) {
    try {
        const result = await prisma[tableName].deleteMany({ where });
        return result;
    } catch (error) {
        console.error(`Error in deleteDataAll for ${tableName}:`, error);
        return { error: error.message || "Unknown error in deleteDataAll" };
    }
}

export async function getFirstDataByWhere(tableName, where) {
    try {
        const data = await prisma[tableName].findFirst({ where: where });
        return data;
    } catch (error) {
        console.error(`Error in getFirstDataByWhere for ${tableName}:`, error);
        return { error: error.message || "Unknown error in getFirstDataByWhere" };
    }
}

export async function updateManyData(tableName, where, data) {
    try {
        const result = await prisma[tableName].updateMany({ where, data });
        return result;
    } catch (error) {
        console.error(`Error in updateManyData for ${tableName}:`, error);
        return { error: error.message || "Unknown error in updateManyData" };
    }
}