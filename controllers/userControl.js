import asyncHandler from 'express-async-handler';

import { Prisma } from '../config/prismaConfig.js';
export const createUser = asyncHandler(async(req,res)=>{
    let {email} = req.body;

    const userExists= await Prisma.user.findUnique({
        where:{email:email}
    })

    if (!userExists){
        
        const user = await Prisma.user.create({
            data:req.body
        });

        res.send({
            message:"User registered successfully",
            user:user
        });
    }
    else{
        res.send(201).send({message:"User already registered"});
    }
}); 

export const bookVisit = asyncHandler(async (req, res) => {
    const { email, date } = req.body;
    const { id } = req.params;
  
    try {
      const alreadyBooked = await Prisma.user.findUnique({
        where: { email },
        select: { bookedVisits: true },
      });
  
      if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
        res
          .status(400)
          .json({ message: "This residency is already booked by you" });
      } else {
        await Prisma.user.update({
          where: { email: email },
          data: {
            bookedVisits: { push: { id, date } },
          },
        });
        res.send("your visit is booked successfully");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  });

  export const getAllBookings = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
      const bookings = await Prisma.user.findUnique({
        where: { email },
        select: { bookedVisits: true },
      });
      res.status(200).send(bookings);
    } catch (err) {
      throw new Error(err.message);
    }
  });  

  //cancel booking

  export const cancelBooking = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;
    try {
      const user = await Prisma.user.findUnique({
        where: { email: email },
        select: { bookedVisits: true },
      });
  
      const index = user.bookedVisits.findIndex((visit) => visit.id === id);
  
      if (index === -1) {
        res.status(404).json({ message: "Booking not found" });
      } else {
        user.bookedVisits.splice(index, 1);
        await Prisma.user.update({
          where: { email },
          data: {
            bookedVisits: user.bookedVisits,
          },
        });
  
        res.send("Booking cancelled successfully");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  });

  //function to add residency to favorite

  export const toFav = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { rid } = req.params;
  
    try {
      const user = await Prisma.user.findUnique({
        where: { email },
      });
  
      if (user.favResidenciesID.includes(rid)) {
        const updateUser = await Prisma.user.update({
          where: { email },
          data: {
            favResidenciesID: {
              set: user.favResidenciesID.filter((id) => id !== rid),
            },
          },
        });
  
        res.send({ message: "Removed from favorites", user: updateUser });
      } else {
        const updateUser = await Prisma.user.update({
          where: { email },
          data: {
            favResidenciesID: {
              push: rid,
            },
          },
        });
        res.send({ message: "Updated favorites", user: updateUser });
      }
    } catch (err) {
      throw new Error(err.message);
    }
  });

  export const getAllFavorites = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
      const favResd = await Prisma.user.findUnique({
        where: { email },
        select: { favResidenciesID: true },
      });
      res.status(200).send(favResd);
    } catch (err) {
      throw new Error(err.message);
    }
  });  