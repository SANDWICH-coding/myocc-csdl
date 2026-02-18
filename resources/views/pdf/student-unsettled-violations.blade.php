<!DOCTYPE html>
<html>

<head>
    <title>Unsettled Violations</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .title-top {
            font-size: 15px;
        }

        .title-mid {
            font-size: 12px;
            padding-top: 5px;
            margin-top: 5px;
            padding-bottom: 5px;
            border-top: #232323 solid 1px;
            border-bottom: #232323 solid 1px;
        }

        .title-bot {
            font-weight: bold;
            font-size: 13px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        table,
        th,
        td {
            border: 1px solid black;
        }

        th,
        td {
            padding: 6px;
            text-align: left;
        }

        .signature {
            margin-top: 60px;
        }
    </style>
</head>

<body>

    <div class="header-table">
        <table width="100%" style="border: none; margin-bottom: 50px;">
            <tr>
                <td width="20%" style="text-align: right; border: none;">
                    <img src="{{ public_path('assets/images/school-logo.png') }}" width="70">
                </td>

                <td width="60%" style="text-align: center; border: none;">
                    <div class="title-top">Opol Community College</div>
                    <div class="title-mid">CENTER FOR STUDENT DEVELOPMENT AND LEADERSHIP</div>
                    <div class="title-bot">Office of the CSDL</div>
                </td>

                <td width="20%" style="text-align: left; border: none;">
                    <img src="{{ public_path('assets/images/csdl-logo.jpg') }}" width="70">
                </td>
            </tr>
        </table>
    </div>



    <p style="
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
    text-decoration: underline;
">
        {{ $user->user_id_no }}
    </p>

    <table>
        <thead>
            <tr>
                <th>Reference #</th>
                <th>Issued Date</th>
                <th>Violation(s)</th>
                <th>Sanction</th>
            </tr>
        </thead>
        <tbody>
            @forelse($violations as $row)
                <tr>
                    <td>{{ $row->reference_no }}</td>
                    <td>{{ \Carbon\Carbon::parse($row->issued_date_time)->format('M d, Y h:i A') }}</td>
                    <td>
                        @if($row->violation_codes && count($row->violation_codes))
                            @foreach($row->violation_codes as $code)
                                <span
                                    style="
                                                                                                                                                                                                            display: inline-block;
                                                                                                                                                                                                            color: #1d4ed8;
                                                                                                                                                                                                            font-weight: bold;
                                                                                                                                                                                                            background-color: #dbeafe;
                                                                                                                                                                                                            padding: 3px 8px;
                                                                                                                                                                                                            margin: 2px 2px 2px 0;
                                                                                                                                                                                                            border-radius: 12px;
                                                                                                                                                                                                            border: 1px solid #93c5fd;
                                                                                                                                                                                                            font-size: 10px;
                                                                                                                                                                                                        ">
                                    {{ $code }}
                                </span>
                            @endforeach
                        @else
                            -
                        @endif
                    </td>

                    <td>
                        @if($row->sanction)

                            @if($row->sanction->sanction_type === 'monetary')
                                <span
                                    style="
                                                                                                                                                                                                                                                                        color: #b91c1c;
                                                                                                                                                                                                                                                                        font-weight: bold;
                                                                                                                                                                                                                                                                        background-color: #fee2e2;
                                                                                                                                                                                                                                                                        padding: 2px 6px;
                                                                                                                                                                                                                                                                        border-radius: 4px;
                                                                                                                                                                                                                                                                        border: 1px solid #fca5a5;
                                                                                                                                                                                                                                                                    ">
                                    {{ $row->sanction->sanction_name }}
                                    - Php {{ number_format($row->sanction->monetary_amount, 2) }}
                                </span>

                            @elseif($row->sanction->sanction_type === 'service')
                                <span
                                    style="
                                                                                                                                                                                                                                                                        color: #1d4ed8;
                                                                                                                                                                                                                                                                        font-weight: bold;
                                                                                                                                                                                                                                                                        background-color: #dbeafe;
                                                                                                                                                                                                                                                                        padding: 2px 6px;
                                                                                                                                                                                                                                                                        border-radius: 4px;
                                                                                                                                                                                                                                                                        border: 1px solid #93c5fd;
                                                                                                                                                                                                                                                                    ">
                                    {{ $row->sanction->sanction_name }}
                                    - {{ $row->sanction->service_time }}
                                    {{ ucfirst($row->sanction->service_time_type) }}
                                </span>

                            @else
                                <span style="font-weight: bold;">
                                    {{ $row->sanction->sanction_name }}
                                </span>
                            @endif

                        @else
                            -
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align:center;">No unsettled violations found.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table width="100%" style="margin-top: 70px;">
        <tr>
            <!-- LEFT COLUMN : SIGNATURE -->
            <td width="50%" style="vertical-align: top; border-right: none;">
                <div style="
                width: 90%;
                padding: 20px;
                border: 1px solid #000;
                text-align: center;
            ">
                    <div style="height: 50px;"></div>

                    <div style="
                    padding-top: 5px;
                    font-size: 11px;
                ">
                        <span>_____________________________________</span> <br>
                        <span>Signature Over Printed Name of Authorized Personnel</span>
                    </div>
                </div>
            </td>

            <!-- RIGHT COLUMN : APP GENERATED VERIFIED -->
            <td width="50%" style="vertical-align: top; text-align: right; border-left: none;">
                <div style="
                width: 90%;
                padding: 20px;
                font-size: 11px;
                text-align: left;
                display: inline-block;
            ">
                    <strong>App Generated Verified</strong>
                    <br><br>
                    Verified by myOCC App
                    <br>
                    {{ now()->format('F d, Y h:i A') }}
                </div>
            </td>
        </tr>
    </table>

</body>

</html>