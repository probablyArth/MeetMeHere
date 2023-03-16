import axios, { AxiosInstance } from "axios";
import { env } from "~/env.mjs";
import jwt from "jsonwebtoken";
import uuid4 from "uuid4";

interface HMSResponse {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  customer: string;
  template_id: string;
}

const generateManagementToken = () => {
  try {
    var payload = {
      access_key: env.HMS_ACCESS_KEY,
      type: "management",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
    };

    const managementToken = jwt.sign(payload, env.HMS_SECRET, {
      algorithm: "HS256",
      expiresIn: "24h",
      jwtid: uuid4(),
    });
    return managementToken;
  } catch (e) {
    console.error(
      "An error occured while generating management token for server: \n",
      e
    );
    process.exit(1);
  }
};

class hmsRoomService {
  hmsApi: AxiosInstance = axios.create({
    baseURL: "https://api.100ms.live/v2/rooms",
    headers: {
      Authorization: `Bearer ${generateManagementToken()}`,
      "Content-Type": "application/json",
    },
  });
  async create(meetingId: string, description: string) {
    return this.hmsApi.post<
      {},
      HMSResponse,
      { name: string; description: string; template_id: string }
    >("/", {
      name: meetingId,
      description: description,
      template_id: env.HMS_TEMPLATE_ID,
    });
  }
  async disable(roomId: string) {
    return this.hmsApi.post<any, HMSResponse, { enabled: boolean }>(
      `/${roomId}`,
      {
        enabled: false,
      }
    );
  }
}

const HMSroomService = new hmsRoomService();
export default HMSroomService;
