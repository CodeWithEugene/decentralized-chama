import { NextRequest, NextResponse } from 'next/server';

// GET /api/group/[id]/members - List all members
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;

    // TODO: Fetch members from smart contract
    const members = [
      {
        address: '0x742d35Cc6634C0532925a3b844Bc9e7595f9f2c',
        name: 'John Smith',
        totalContributions: '2500',
        status: 'active',
        joinDate: 1704067200,
        lastContribution: 1711324800,
      },
      {
        address: '0x8a2f3F0b8c7e5d4a2f1e9c8b7a6d5e4f3c2b1a09',
        name: 'Sarah Johnson',
        totalContributions: '2100',
        status: 'active',
        joinDate: 1704067200,
        lastContribution: 1711324800,
      },
    ];

    return NextResponse.json({ groupId, members });
  } catch (error) {
    console.error('Failed to fetch members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

// POST /api/group/[id]/members - Add a member
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const groupId = params.id;
    const body = await request.json();
    const { address, name } = body;

    if (!address || !name) {
      return NextResponse.json(
        { error: 'Address and name are required' },
        { status: 400 }
      );
    }

    // TODO: Call smart contract to add member
    console.log('Adding member to group:', groupId, { address, name });

    const transactionHash = '0x' + Math.random().toString(16).slice(2);

    return NextResponse.json({
      success: true,
      groupId,
      address,
      name,
      transactionHash,
    });
  } catch (error) {
    console.error('Failed to add member:', error);
    return NextResponse.json(
      { error: 'Failed to add member' },
      { status: 500 }
    );
  }
}
