import { NextRequest, NextResponse } from 'next/server';

// GET /api/group/[id]/payouts - List all payouts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;
    const { searchParams } = new URL(request.url);
    const round = searchParams.get('round');

    // TODO: Fetch payouts from smart contract
    const payouts = [
      {
        id: '1',
        recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f9f2c',
        amount: '1200',
        round: 1,
        status: 'completed',
        transactionHash: '0x1234567890abcdef',
        timestamp: 1708716000,
      },
      {
        id: '2',
        recipient: '0x8a2f3F0b8c7e5d4a2f1e9c8b7a6d5e4f3c2b1a09',
        amount: '1200',
        round: 1,
        status: 'completed',
        transactionHash: '0x2345678901bcdefg',
        timestamp: 1708716000,
      },
      {
        id: '3',
        recipient: '0x5c4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e',
        amount: '1200',
        round: 2,
        status: 'pending',
        transactionHash: '0x3456789012cdefgh',
        timestamp: 1711324800,
      },
    ];

    const filtered = round
      ? payouts.filter((p) => p.round === parseInt(round as string))
      : payouts;

    return NextResponse.json({
      groupId,
      payouts: filtered,
    });
  } catch (error) {
    console.error('Failed to fetch payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    );
  }
}

// POST /api/group/[id]/payouts - Process a payout
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;
    const body = await request.json();
    const { recipientAddress, amount, round } = body;

    if (!recipientAddress || !amount) {
      return NextResponse.json(
        { error: 'Recipient address and amount are required' },
        { status: 400 }
      );
    }

    // TODO: Call smart contract to process payout
    console.log('Processing payout:', { groupId, recipientAddress, amount, round });

    const transactionHash = '0x' + Math.random().toString(16).slice(2);

    return NextResponse.json({
      success: true,
      groupId,
      recipientAddress,
      amount,
      round,
      transactionHash,
      status: 'pending',
      timestamp: Math.floor(Date.now() / 1000),
    });
  } catch (error) {
    console.error('Failed to process payout:', error);
    return NextResponse.json(
      { error: 'Failed to process payout' },
      { status: 500 }
    );
  }
}
