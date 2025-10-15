import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const client = await clientPromise;
    const db = client.db("demo");
    const resolvedParams = await context.params;
    const id = resolvedParams.id;
    const body = await request.json();

    const { status, analysis } = body;

    await db.collection("leads").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, analysis } }
    );

    return NextResponse.json({ message: "Lead updated successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error updating lead" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const client = await clientPromise;
    const db = client.db("demo");
    const resolvedParams = await context.params;
    const id = resolvedParams.id;

    await db.collection("leads").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Lead deleted successfully" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Error deleting lead" }, { status: 500 });
  }
}