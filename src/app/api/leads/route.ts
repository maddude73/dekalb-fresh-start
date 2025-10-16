
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { leadSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("demo");
    const body = await request.json();
    const validatedData = leadSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ errors: validatedData.error.flatten().fieldErrors }, { status: 400 });
    }

    const { fullName, phone, email, address, city, state, zip, freshStartAmount } = validatedData.data;

    const standardizedAddress = address.trim().toUpperCase();
    const standardizedCity = city.trim().toUpperCase();
    const standardizedState = state.trim().toUpperCase();
    const standardizedZip = zip.trim(); // Zip codes might have specific formats, so only trim for now.

    const existingLead = await db.collection("leads").findOne({
      address: standardizedAddress,
      city: standardizedCity,
      state: standardizedState,
      zip: standardizedZip,
    });

    if (existingLead) {
      // Update existing lead
      await db.collection("leads").updateOne(
        { _id: existingLead._id },
        { $set: {
            name: fullName || existingLead.name,
            phone: phone || existingLead.phone,
            email: email || existingLead.email,
            freshStartAmount: freshStartAmount,
            updatedAt: new Date(),
          }
        }
      );
      return NextResponse.json({ message: "Lead updated successfully", status: "updated" });
    }

    const lead = {
      fullName,
      phone,
      email,
      address: standardizedAddress,
      city: standardizedCity,
      state: standardizedState,
      zip: standardizedZip,
      freshStartAmount,
      createdAt: new Date(),
      status: "New",
    };

    await db.collection("leads").insertOne(lead);

    return NextResponse.json({ message: "Lead created successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error creating lead" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("demo");
    const leads = await db.collection("leads").find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(leads);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error fetching leads" }, { status: 500 });
  }
}
