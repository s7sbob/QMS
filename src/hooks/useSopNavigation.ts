import { useNavigate } from 'react-router-dom';
import axiosServices from 'src/utils/axiosServices';

// Status IDs that should open in Request Form
const REQUEST_FORM_STATUS_IDS = ['8', '11', '12', '13', '14', '15', '17'];

// Status IDs that should open in New_Creation_SOP
const NEW_CREATION_STATUS_IDS = ['16', '1'];

export interface SopNavigationResult {
  success: boolean;
  destination: 'Request_Form' | 'New_Creation_SOP' | 'SOPFullDocument';
  status: string;
  statusName: string;
}

export const useSopNavigation = () => {
  const navigate = useNavigate();

  /**
   * Navigate to the appropriate page based on SOP header status
   * @param sopHeaderId - The SOP header ID
   * @returns Promise with navigation result
   */
  const navigateToSop = async (sopHeaderId: string): Promise<SopNavigationResult> => {
    console.log('=== SOP Navigation ===');
    console.log('SOP Header ID:', sopHeaderId);

    try {
      // Fetch the current SOP header to get the status
      const response = await axiosServices.get(`/api/sopheader/getSopHeaderById/${sopHeaderId}`);
      const sopHeader = response.data;

      const statusId = String(sopHeader?.Sop_Status?.Id || sopHeader?.status || '');
      const statusName = sopHeader?.Sop_Status?.Name_en || sopHeader?.Sop_Status?.Name_ar || 'Unknown';

      console.log('Status ID:', statusId);
      console.log('Status Name:', statusName);

      let destination: 'Request_Form' | 'New_Creation_SOP' | 'SOPFullDocument';

      // Determine destination based on status
      if (REQUEST_FORM_STATUS_IDS.includes(statusId)) {
        destination = 'Request_Form';
        console.log('Decision: Opening in Request Form (status in request workflow)');
        navigate(`/documentation-control/Request_Form?headerId=${sopHeaderId}`);
      } else if (NEW_CREATION_STATUS_IDS.includes(statusId)) {
        destination = 'New_Creation_SOP';
        console.log('Decision: Opening in New_Creation_SOP (status 16 or 1)');
        navigate(`/documentation-control/New_Creation_SOP?headerId=${sopHeaderId}`);
      } else {
        destination = 'SOPFullDocument';
        console.log('Decision: Opening in SOPFullDocument (other status)');
        navigate(`/SOPFullDocument?headerId=${sopHeaderId}`);
      }

      console.log('=== Navigation Complete ===');

      return {
        success: true,
        destination,
        status: statusId,
        statusName,
      };
    } catch (error) {
      console.error('Error fetching SOP header for navigation:', error);

      // Fallback: open in SOPFullDocument if we can't fetch the status
      console.log('Fallback: Opening in SOPFullDocument due to error');
      navigate(`/SOPFullDocument?headerId=${sopHeaderId}`);

      return {
        success: false,
        destination: 'SOPFullDocument',
        status: '',
        statusName: 'Error',
      };
    }
  };

  /**
   * Get the destination without navigating (useful for previewing)
   * @param sopHeaderId - The SOP header ID
   * @returns Promise with navigation result
   */
  const getDestination = async (sopHeaderId: string): Promise<SopNavigationResult> => {
    console.log('=== SOP Destination Check ===');
    console.log('SOP Header ID:', sopHeaderId);

    try {
      const response = await axiosServices.get(`/api/sopheader/getSopHeaderById/${sopHeaderId}`);
      const sopHeader = response.data;

      const statusId = String(sopHeader?.Sop_Status?.Id || sopHeader?.status || '');
      const statusName = sopHeader?.Sop_Status?.Name_en || sopHeader?.Sop_Status?.Name_ar || 'Unknown';

      console.log('Status ID:', statusId);
      console.log('Status Name:', statusName);

      let destination: 'Request_Form' | 'New_Creation_SOP' | 'SOPFullDocument';

      if (REQUEST_FORM_STATUS_IDS.includes(statusId)) {
        destination = 'Request_Form';
      } else if (NEW_CREATION_STATUS_IDS.includes(statusId)) {
        destination = 'New_Creation_SOP';
      } else {
        destination = 'SOPFullDocument';
      }

      console.log('Destination:', destination);

      return {
        success: true,
        destination,
        status: statusId,
        statusName,
      };
    } catch (error) {
      console.error('Error fetching SOP header:', error);
      return {
        success: false,
        destination: 'SOPFullDocument',
        status: '',
        statusName: 'Error',
      };
    }
  };

  return {
    navigateToSop,
    getDestination,
    REQUEST_FORM_STATUS_IDS,
    NEW_CREATION_STATUS_IDS,
  };
};

export default useSopNavigation;
