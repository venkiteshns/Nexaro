import bcrypt from "bcrypt";

export const hashData = async (data) => {
    return await bcrypt.hash(data, 10);
};

export const compareHash = async (data, hash) => {
    return await bcrypt.compare(data, hash);
};