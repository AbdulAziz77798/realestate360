import asyncHandler from "express-async-handler";

import { Prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
    const {
      title,
      description,
      price,
      address,
      country,
      city,
      facilities,
      image,
      userEmail,
    } = req.body.data;
  
    console.log(req.body.data);
    try {
      const residency = await Prisma.residency.create({
        data: {
          title,
          description,
          price,
          address,
          country,
          city,
          facilities,
          image,
          owner: { connect: { email: userEmail } },
        },
      });
      res.send({ message: "Residency created successfully", residency });
    } catch (err){
        if (err.code === "P2002"){
            throw new Error("A residency with address already there");
        }
        throw new Error(err.message)
    }
  });

  export const getAllResidencies = asyncHandler(async (req, res) => {
    try {
      const residencies = await Prisma.residency.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      res.send(residencies);
    } catch (err) {
      res.status(500).send({
        message: "An error occurred while fetching residencies",
        error: err.message,
      });
    }
  });

  //get a specific document

  export const getResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    try {
      const residency = await Prisma.residency.findUnique({
        where: { id },
      });
      res.send(residency);
    } catch (err) {
      throw new Error(err.message);
    }
  }); 