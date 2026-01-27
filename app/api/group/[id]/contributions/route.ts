import { NextRequest, NextResponse } from 'next/server';

// GET /api/group/[id]/contributions - List all contributions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '50';

    // TODO: Fetch contributions from smart contract
    const contributions = [
      {
        id: '1',
        member: '0x742d35Cc6634C0532925a3b844Bc9e7595f9f2c',
        amount: '500',
        timestamp: 1711324800,
        transactionHash: '0x1234567890abcdef',
        status: 'confirmed',
      },
      {
        id: '2',
        member: '0x8a2f3F0b8c7e5d4a2f1e9c8b7a6d5e4f3c2b1a09',
        amount: '500',
        timestamp: 1711238400,
        transactionHash: '0x2345678901bcdefg',
        status: 'confirmed',
      },
    ];

    return NextResponse.json({
      groupId,
      contributions: contributions.slice(0, parseInt(limit as string)),
    });
  } catch (error) {
    console.error('Failed to fetch contributions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contributions' },
      { status: 500 }
    );
  }
}

// POST /api/group/[id]/contributions - Submit a contribution
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;
    const body = await request.json();
    const { amount, memberAddress } = body;

    if (!amount || !memberAddress) {
      return NextResponse.json(
        { error: 'Amount and member address are required' },
        { status: 400 }
      );
    }

    // TODO: Call smart contract to process contribution
    console.log('Processing contribution:', { groupId, amount, memberAddress });

    const transactionHash = '0x' + Math.random().toString(16).slice(2);

    return NextResponse.json({
      success: true,
      groupId,
      amount,
      memberAddress,
      transactionHash,
      status: 'pending',
      timestamp: Math.floor(Date.now() / 1000),
    });
  } catch (error) {
    console.error('Failed to process contribution:', error);
    return NextResponse.json(
      { error: 'Failed to process contribution' },
      { status: 500 }
    );
  }
}
